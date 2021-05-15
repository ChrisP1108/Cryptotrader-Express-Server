const express = require('express');
const orderRouter = express.Router();

orderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Order page content will be sent to you');
})
.post((req, res) => {
    res.end(`Order ${req.body.name} will be added`);
})
.put((req, res) => {
    res.end(`Order ${req.body.name} will be modified`);
})
.delete((req, res) => {
    res.end('Order will be deleted');
});

module.exports = orderRouter;