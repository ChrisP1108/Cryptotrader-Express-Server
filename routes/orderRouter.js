const express = require('express');
const Order = require('../models/order');
const orderRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

orderRouter.route('/')
.get((req, res, next) => {
    Order.find()
    .populate('comments.author')
    .then(orders => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(orders);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Order.create(req.body)
    .then(order => {
        console.log('Campsite Created ', order);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /order');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Order.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = orderRouter;