const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },    
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'        
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;