const express = require('express');
const morgan = require('morgan');

// Routes
const homeRouter = require('./routes/homeRouter');
const softwareRouter = require('./routes/softwareRouter');
const orderRouter = require('./routes/orderRouter');
const aboutRouter = require('./routes/aboutRouter');
const contactRouter = require('./routes/contactRouter');
const loginRouter = require('./routes/loginRouter');

// Host & Port Info
const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use('/home', homeRouter);
app.use('/software', softwareRouter);
app.use('/order', orderRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/login', loginRouter);

app.use(express.static(__dirname + '/public'));

app.use((req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is the Cryptotrader Express Server</h1></body></html>');
});

app.listen(port, hostname, () => {
    console.log(`Cryptotrader server running at http://${hostname}:${port}/`);
});
