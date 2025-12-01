const express = require('express');
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

const authRoutes = require("./src/routes/route");
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});