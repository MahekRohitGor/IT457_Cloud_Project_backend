const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    item_id: { type: Number, required: true },     // From Admin MS (Postgres numeric ID)
    item_name: { type: String, required: true },   // Snapshot
    price: { type: Number, required: true },
    qty: { type: Number, default: 1 }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    user_id: { type: Number, required: true },     // From Auth MS
    items: { type: [cartItemSchema], default: [] }
}, { timestamps: true, collection: "tbl_cart" });

module.exports = mongoose.model("Cart", cartSchema);