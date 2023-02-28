require('dotenv').config();
const express = require('express');
const path = require('path');
const request = require('request');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = process.env.PORT || 3000;
const siteKey = process.env.SITE_KEY || "";
const secretKey = process.env.SECRET_KEY || "";

app.get('/', function (req, res) {
    res.render('index', { siteKey: siteKey });
});

app.post('/add', function (req, res) {

    const { name } = req.body;

    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.redirect('/?error=TokenError');
    }

    const token = req.body['g-recaptcha-response'];
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + token + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL, function (error, response, body) {
        body = JSON.parse(body);

        if (body.success !== undefined && !body.success) {
            return res.redirect('/?error=VerificationFailed');
        }
        return res.redirect('/?success=VerificationSucceed');
    });
});

app.listen(PORT, function () {
    console.log('Server is running at port: ', PORT);
});