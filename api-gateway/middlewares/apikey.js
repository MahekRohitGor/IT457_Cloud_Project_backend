require("dotenv").config();

function validateApiKey(req, res, next) {
    const key = req.headers["x-api-key"];

    if (!key || key !== process.env.API_KEY) {
        return res.status(401).json({ 
            success: false,
            message: "Invalid or missing API Key" 
        });
    }

    next();
}

module.exports = validateApiKey;