const express = require('express');
const Order = require('../models/order');
const orderRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

orderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Order.find()
    .populate('placement.author')
    .then(order => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Order.create(req.body)
    .then(order => {
        console.log('Order Page Content Added: ', order);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /order');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Order.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

orderRouter.route('/:orderId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('placement.author')
    .then(order => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /order/${req.params.orderId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Order.findByIdAndUpdate(req.params.orderId, {
        $set: req.body
    }, { new: true })
    .then(order => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Order.findByIdAndDelete(req.params.orderId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

orderRouter.route('/:orderId/placement')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('placement.author')
    .then(order => {
        if (order) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(order.placement);
        } else {
            err = new Error(`Campsite ${req.params.orderId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Order.findById(req.params.orderId)
    .then(order => {
        if (order) {
            req.body.author = req.user._id;
            order.placement.push(req.body);
            contact.save()
            .then(order => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Order ${req.params.orderId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /order/${req.params.orderId}/placement`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Order.findById(req.params.orderId)
    .then(order => {
        if (order) {
            for (let i = (order.placement.length-1); i >= 0; i--) {
                order.placement.id(order.placement[i]._id).remove();
            }
            order.save()
            .then(order => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Order Placement ${req.params.contactId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

orderRouter.route('/:orderId/placement/:placementId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('placement.author')
    .then(order => {
        if (order && order.placement.id(req.params.placementId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(order.placement.id(req.params.placementId));
        } else if (!order) {
            err = new Error(`Order ${req.params.orderId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Order Placement ${req.params.placementId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /order/${req.params.orderId}/placement/${req.params.placementId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Order.findById(req.params.orderId)
    .then(order => {  
        if ((req.user._id).equals(order.placement.id(req.params.placementId).author._id)) {
            if (order && order.placement.id(req.params.placementId)) {
                if (req.body.id) {
                    order.placement.id(req.params.placementId).id = req.body.id;
                }
                if (req.body.title) {
                    order.placement.id(req.params.placementId).title = req.body.title;
                }
                if (req.body.price) {
                    order.placement.id(req.params.placementId).price = req.body.price;
                }
                order.save()
                .then(order => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(order);
                })
                .catch(err => next(err)); 
            } else if (!order) {
                err = new Error(`Order ${req.params.orderId} not found`);
                err.status = 404;
                return next(err);
            } else {
                err = new Error(`Order Placement ${req.params.placementId} not found`);
                err.status = 404;
                return next(err);
            }
        } else {
            err = new Error('Unauthorized');
            err.status = 403;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Order.findById(req.params.orderId)
    .then(order => {
        if ((req.user._id).equals(order.placement.id(req.params.placementId).author._id)) {
            if (order && order.placement.id(req.params.placementId)) {
                order.placement.id(req.params.placementId).remove();
                order.save()
                .then(order => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(order);
                })
                .catch(err => next(err));
            } else if (!order) {
                err = new Error(`Order ${req.params.orderId} not found`);
                err.status = 404;
                return next(err);
            } else {
                err = new Error(`Order Placement ${req.params.placementId} not found`);
                err.status = 404;
                return next(err);
            }
        } else {
            err = new Error('Unauthorized');
            err.status = 403;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = orderRouter;