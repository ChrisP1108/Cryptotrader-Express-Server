const express = require('express');
const Contact = require('../models/contact');
const contactRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

contactRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Contact.find()
    .populate('input.author')
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
    .populate('input.author')
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

contactRouter.route('/:contactId/input')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Contact.findById(req.params.contactId)
    .populate('input.author')
    .then(contact => {
        if (contact) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(contact.input);
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
            contact.input.push(req.body);
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
    res.end(`PUT operation not supported on /contact/${req.params.contactId}/input`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Contact.findById(req.params.contactId)
    .then(contact => {
        if (contact) {
            for (let i = (contact.input.length-1); i >= 0; i--) {
                contact.input.id(contact.input[i]._id).remove();
            }
            contact.save()
            .then(contact => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(contact);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Contact input ${req.params.contactId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

contactRouter.route('/:contactId/input/:inputId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Contact.findById(req.params.contactId)
    .populate('input.author')
    .then(contact => {
        if (contact && contact.input.id(req.params.inputId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(contact.input.id(req.params.inputId));
        } else if (!contact) {
            err = new Error(`Contact ${req.params.contactId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`input ${req.params.inputId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /contact/${req.params.contactId}/input/${req.params.inputId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Contact.findById(req.params.contactId)
    .then(contact => {  
        if ((req.user._id).equals(contact.input.id(req.params.inputId).author._id)) {
            if (contact && contact.input.id(req.params.inputId)) {
                if (req.body.firstName) {
                    contact.input.id(req.params.inputId).firstName = req.body.firstName;
                }
                if (req.body.lastName) {
                    contact.input.id(req.params.inputId).lastName = req.body.lastName;
                }
                if (req.body.phoneNum) {
                    contact.input.id(req.params.inputId).phoneNum = req.body.phoneNum;
                }
                if (req.body.email) {
                    contact.input.id(req.params.inputId).email = req.body.email;
                }
                if (req.body.agree) {
                    contact.input.id(req.params.inputId).agree = req.body.agree;
                }
                if (req.body.feedback) {
                    contact.input.id(req.params.inputId).feedback = req.body.feedback;
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
                err = new Error(`input ${req.params.inputId} not found`);
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
        if ((req.user._id).equals(contact.input.id(req.params.inputId).author._id)) {
            if (contact && contact.input.id(req.params.inputId)) {
                contact.input.id(req.params.inputId).remove();
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
                err = new Error(`input ${req.params.inputId} not found`);
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