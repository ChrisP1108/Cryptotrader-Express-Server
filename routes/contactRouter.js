const express = require('express');
const Contact = require('../models/contact');
const contactRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

contactRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Contact.find()
    .populate('comments.author')
    .then(contact => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(contact);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Contact.create(req.body)
    .then(contact => {
        console.log('Contact Page Content Added: ', contact);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(contact);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Contact.findByIdAndUpdate(req.params.contactId, {
        $set: req.body
    }, { new: true })
    .then(contact => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(contact);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Contact.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = contactRouter;