const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully (User Service)");
    })
    .catch((err) => {
        console.error("MongoDB Connection Error:", err);
    });

module.exports = mongoose;