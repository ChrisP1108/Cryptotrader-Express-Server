const express = require('express');
const loginRouter = express.Router();

loginRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Login modal content will be sent to you');
})
.post((req, res) => {
    res.end(`Login ${req.body.name} will be added`);
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