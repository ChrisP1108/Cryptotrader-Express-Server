const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;