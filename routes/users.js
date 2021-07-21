const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const db = require(path.join(rootDir, 'models', 'db.js'));

const router = express.Router();

//register
router.get('/register', (req, res, next) => {
    res.render('user-register.ejs');
});

router.post('/register', (req, res, next) => {
    db.registerUser(Object.values(req.body));
    res.redirect('/');
});

//sign-in
router.get('/sign-in', (req, res, next) => {
    res.render('user-sign-in.ejs');
});

router.post('/sign-in', (req, res, next) => {
    res.redirect('/');
});

module.exports = router;