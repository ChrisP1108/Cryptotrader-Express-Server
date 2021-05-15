const express = require('express');
const contactRouter = express.Router();

contactRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Contact page content will be sent to you');
})
.post((req, res) => {
    res.end(`Contact ${req.body.name} will be added`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /contact');
})
.delete((req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /contact');
});

module.exports = contactRouter;