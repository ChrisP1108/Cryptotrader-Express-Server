const express = require('express');
const Index = require('../models/index');
const indexRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

indexRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Index.find()
    .then(index => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(index);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    Index.create(req.body)
    .then(index => {
        console.log('Index Page Content Added: ', index);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(index);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Index.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

indexRouter.route('/:indexId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Index.findById(req.params.indexId)
    .then(index => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(index);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /${req.params.indexId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Index.findByIdAndUpdate(req.params.indexId, {
        $set: req.body
    }, { new: true })
    .then(index => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(index);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Index.findByIdAndDelete(req.params.indexId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = indexRouter;