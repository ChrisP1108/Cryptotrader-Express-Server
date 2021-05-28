const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const orderSchema = new Schema({
    cartItems: {
        type: Object,
        required: true
    },
    cartTotal: {
        type: Currency,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;