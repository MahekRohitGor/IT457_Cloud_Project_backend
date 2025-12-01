const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
    const openPaths = [
        "/login",
        "/signup",
        "/verify-otp",
        "/forgot-pass",
        "/verify-reset-otp",
        "/reset-password"
    ];

    if (openPaths.includes(req.path.toLowerCase())) {
        return next();
    } else {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Missing token" });
        } else {
            const token = authHeader.split(" ")[1];
            console.log(token);
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log("Decoded JWT:", decoded);
                req.headers["x-user-id"] = decoded.user_id;
                next();
            } catch (err) {
                console.log(err);
                return res.status(401).json({ message: "Invalid token" });
            }
        }
    }
}

module.exports = { verifyJWT }