const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user_id: { type: Number, required: true },      // Auth MS ID
    street_address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip_code: { type: String, required: true },
    phone: { type: String, required: true },
    is_deleted: { type: Boolean, default: false }
}, { timestamps: true, collection: "tbl_address" });

module.exports = mongoose.model("Address", addressSchema);