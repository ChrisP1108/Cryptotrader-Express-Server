const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const softwareSchema = new Schema({
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
    button: {
        type: String,
        required: true      
    },
    link: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Software = mongoose.model('Software', softwareSchema);

module.exports = Software;