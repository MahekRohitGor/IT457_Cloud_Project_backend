const express = require('express');
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const adminRoutes = require("./src/routes/route");
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});