const mongoose = require("mongoose");
const orderItemSchema = require("./OrderItem");

const orderSchema = new mongoose.Schema({
    order_number: { type: String, required: true, unique: true },

    user_id: { type: Number, required: true },
    address: {
        street_address: String,
        city: String,
        state: String,
        zip_code: String,
        phone: String
    },

    items: [orderItemSchema],

    sub_total: { type: Number, required: true },
    tax_percentage: { type: Number, default: 5 },
    tax_amount: { type: Number, required: true },
    delivery_fee: { type: Number, default: 30 },
    total_amount: { type: Number, required: true },

    payment_method_id: Number,
    payment_status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded", "cod_pending"],
        default: "pending"
    },

    order_status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },

    delivery_status: {
        type: String,
        enum: [
            "pending",
            "preparing",
            "ready",
            "out_for_delivery",
            "delivered",
            "cancelled"
        ],
        default: "pending"
    },

    payment_id: String,
    payment_signature: String,
    payment_reference: String

}, { timestamps: true, collection: "tbl_order" });

module.exports = mongoose.model("Order", orderSchema);