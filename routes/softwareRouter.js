const express = require('express');
const softwareRouter = express.Router();

softwareRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Software page content will be sent to you');
})
.post((req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /software');
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /software');
})
.delete((req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /software');
});

module.exports = softwareRouter;