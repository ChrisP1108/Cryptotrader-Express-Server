const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const homeSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
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
    button: {
        type: String,
        required: true      
    },
    link: {
        type: String,
        required: true
    },
    inverted: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Home = mongoose.model('Home', homeSchema);

module.exports = Home;