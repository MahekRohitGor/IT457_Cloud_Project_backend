require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const routes = require("./routes");
const {errorHandler} = require("./middlewares/errorHandler");
const {limiter} = require("./middlewares/rateLimiter");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(cors());
// app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Basic Rate Limiting on the Gateway
app.use(limiter);

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({status: 'API Gateway is healthy'});
});

// API Routes
app.use('/', routes);
app.use(errorHandler);

// Start the Server
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});