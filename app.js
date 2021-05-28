//Imports
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger  =require('morgan');
const passport = require('passport');
const config = require('./config');

app.use(morgan('dev'));
app.use(express.json());

// Routes
const indexRouter = require('./routes/indexRouter');
const softwareRouter = require('./routes/softwareRouter');
const orderRouter = require('./routes/orderRouter');
const aboutRouter = require('./routes/aboutRouter');
const contactRouter = require('./routes/contactRouter');
const loginRouter = require('./routes/loginRouter');

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

// Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));

// Route Links
app.use('/', indexRouter);

app.use(express.static(__dirname + '/public'));

app.use('/software', softwareRouter);
app.use('/order', orderRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/login', loginRouter);

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
