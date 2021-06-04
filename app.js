//Imports
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const config = require('./config');


// Routes
const indexRouter = require('./routes/index');
const homeRouter = require('./routes/homeRouter');
const softwareRouter = require('./routes/softwareRouter');
const orderRouter = require('./routes/orderRouter');
const aboutRouter = require('./routes/aboutRouter');
const contactRouter = require('./routes/contactRouter');
const usersRouter = require('./routes/usersRouter');

// Mongoose
const mongoose = require('mongoose')

// MongoDB Server
const url = config.mongoUrl;
const connect = mongoose.connect (url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Connection Log
connect.then(() => console.log('Connected correctly to server'),
    err => console.log(err)
);

// App Express
const app = express();


//Redirect Message
app.all('*', (req, res, next) => {
    if (req.secure) {
        return next();
    } else {
        console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
        res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
    }
});

// Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Passport 
app.use(passport.initialize());

// Route Links
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(__dirname + '/public'));

app.use('/home', homeRouter)
app.use('/software', softwareRouter);
app.use('/order', orderRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);

// 404 Error And Forward To Error Handler
app.use(function(req, res, next) {
    next(createError(404));
});

// Error Handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Module Export
module.exports = app;
