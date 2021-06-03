const express = require('express');
const Contact = require('../models/contact');
const contactRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

contactRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Contact.find()
    .populate('feedback.author')
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
    res.statusCode = 403;
    res.end('PUT operation not supported on /contact');
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

contactRouter.route('/:contactId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Contact.findById(req.params.contactId)
    .populate('feedback.author')
    .then(contact => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(contact);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /contact/${req.params.contactId}`);
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
    Contact.findByIdAndDelete(req.params.contactId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

contactRouter.route('/:contactId/feedback')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Contact.findById(req.params.contactId)
    .populate('feedback.author')
    .then(contact => {
        if (contact) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(contact.feedback);
        } else {
            err = new Error(`Campsite ${req.params.contactId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Contact.findById(req.params.contactId)
    .then(contact => {
        if (contact) {
            req.body.author = req.user._id;
            contact.feedback.push(req.body);
            contact.save()
            .then(contact => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(contact);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Campsite ${req.params.contactId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /contact/${req.params.contactId}/feedback`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Contact.findById(req.params.contactId)
    .then(contact => {
        if (contact) {
            for (let i = (contact.feedback.length-1); i >= 0; i--) {
                contact.feedback.id(contact.feedback[i]._id).remove();
            }
            contact.save()
            .then(contact => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(contact);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Contact Feedback ${req.params.contactId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

contactRouter.route('/:contactId/feedback/:feedbackId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Contact.findById(req.params.contactId)
    .populate('feedback.author')
    .then(contact => {
        if (contact && contact.feedback.id(req.params.feedbackId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite.comments.id(req.params.feedbackId));
        } else if (!contact) {
            err = new Error(`Contact ${req.params.contactId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Feedback ${req.params.feedbackId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /contact/${req.params.contactId}/feedback/${req.params.feedbackId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Contact.findById(req.params.contactId)
    .then(contact => {  
        if ((req.user._id).equals(contact.feedback.id(req.params.feedbackId).author._id)) {
            if (contact && contact.feedback.id(req.params.feedbackId)) {
                if (req.body.rating) {
                    contact.feedback.id(req.params.feedbackId).rating = req.body.rating;
                }
                if (req.body.text) {
                    contact.feedback.id(req.params.feedbackId).text = req.body.text;
                }
                contact.save()
                .then(contact => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(contact);
                })
                .catch(err => next(err)); 
            } else if (!contact) {
                err = new Error(`Contact ${req.params.contactId} not found`);
                err.status = 404;
                return next(err);
            } else {
                err = new Error(`Feedback ${req.params.feedbackId} not found`);
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
    Contact.findById(req.params.contactId)
    .then(contact => {
        if ((req.user._id).equals(contact.feedback.id(req.params.feedbackId).author._id)) {
            if (contact && contact.feedback.id(req.params.feedbackId)) {
                contact.feedback.id(req.params.feedbackId).remove();
                contact.save()
                .then(contact => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(contact);
                })
                .catch(err => next(err));
            } else if (!contact) {
                err = new Error(`Contact ${req.params.contactId} not found`);
                err.status = 404;
                return next(err);
            } else {
                err = new Error(`Feedback ${req.params.feedbackId} not found`);
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

module.exports = contactRouter;