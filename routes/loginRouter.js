const express = require('express');
const Login = require('../models/login');
const loginRouter = express.Router();
const authenticate = require('../authenticate');

loginRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Login modal content will be sent to you');
})
.post('/login', passport.authenticate('local'), (req, res) => {
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /login');
})
.delete((req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /login');
});

module.exports = loginRouter;