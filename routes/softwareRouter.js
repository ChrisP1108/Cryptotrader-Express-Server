const express = require('express');
const Software = require('../models/software');
const softwareRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

softwareRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Software.find()
    .then(software => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(software);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    Software.create(req.body)
    .then(software => {
        console.log('Software Page Content Added: ', software);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(software);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Software.findByIdAndUpdate(req.params.softwareId, {
        $set: req.body
    }, { new: true })
    .then(software => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(software);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Software.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = softwareRouter;