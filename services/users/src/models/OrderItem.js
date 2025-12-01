const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    item_id: { type: Number, required: true },     // From Admin MS
    item_name: { type: String, required: true },
    item_price: { type: Number, required: true },
    qty: { type: Number, required: true },
    total_price: { type: Number, required: true }
}, { _id: false });

module.exports = orderItemSchema;
