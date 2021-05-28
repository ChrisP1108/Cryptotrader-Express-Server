const express = require('express');
const Order = require('../models/order');
const orderRouter = express.Router();
const authenticate = require('../authenticate');

orderRouter.route('/')
.get((req, res) => {
    res.end('Order page content will be sent to you');
})
.post(authenticate.verifyUser, (req, res, next) => {
    Order.create(req.body)
    .then(order => {
        console.log('Campsite Created ', campsite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
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