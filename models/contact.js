const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inputSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNum: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    agree : {
        type: Boolean,
        required: false
    },
    feedback: {
        type: String,
        required: true
    },    
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'        
    }
}, {
    timestamps: true
});

const contactSchema = new Schema({
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
    button: {
        type: String,
        required: true      
    },
    link: {
        type: String,
        required: true
    },
    input: [inputSchema]
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;