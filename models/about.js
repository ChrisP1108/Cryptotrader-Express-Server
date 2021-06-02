const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboutSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    heading: {
        type: String,
        required: true
    },    
    content1: {
        type: String,
        required: true      
    },
    content2: {
        type: String,
        required: true      
    },
    content3: {
        type: String,
        required: true      
    },
    button1: {
        type: String,
        required: true      
    },
    button2: {
        type: String,
        required: true      
    },
    button3: {
        type: String,
        required: true      
    },
    link1: {
        type: String,
        required: true
    },
    link2: {
        type: String,
        required: true
    },
    link3: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const About = mongoose.model('About', aboutSchema);

module.exports = About;