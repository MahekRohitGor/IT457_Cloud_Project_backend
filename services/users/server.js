const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./db/index");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/user/items", require("./src/routes/itemRoutes"));
app.use("/user/cart", require("./src/routes/cartRoutes"));
app.use("/user/address", require("./src/routes/addressRoutes"));
app.use("/user/order", require("./src/routes/orderRoutes"));

app.listen(process.env.PORT || 5003, () => {
    console.log("User Service running on port", process.env.PORT || 5003);
});