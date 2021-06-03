const express = require('express');
const About = require('../models/about');
const aboutRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

aboutRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    About.find()
    .then(campsites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    About.create(req.body)
    .then(about => {
        console.log('About Page Content Added: ', about);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(about);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /about');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    About.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

aboutRouter.route('/:aboutId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    About.findById(req.params.aboutId)
    .then(about => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(about);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /about/${req.params.aboutId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    About.findByIdAndUpdate(req.params.aboutId, {
        $set: req.body
    }, { new: true })
    .then(about => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(about);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    About.findByIdAndDelete(req.params.promotionsId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = aboutRouter;