const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placementSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
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

const orderSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    placement: [placementSchema]
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;