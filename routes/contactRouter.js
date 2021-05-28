const express = require('express');
const Contact = require('../models/contact');
const contactRouter = express.Router();
const authenticate = require('../authenticate');

contactRouter.route('/')
.get((req, res, next) => {
    Contact.find()
    .populate('author')
    .then(contact => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(contact);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Contact.create(req.body)
    .then(contact => {
        console.log('Contact Created ', campsite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(contact);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /contact');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Contact.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = contactRouter;