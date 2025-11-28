const jwt = require("jsonwebtoken");

function verifyAdminJWT(req, res, next) {
    const openPaths = [
        "/login"
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

                if (!decoded.role || !["ADMIN", "SUPER_ADMIN"].includes(decoded.role)) {
                    return res.status(403).json({ message: "Not authorized as admin" });
                }

                req.headers["x-admin-id"] = decoded.admin_id;
                req.headers["x-admin-role"] = decoded.role;
                next();
            } catch (err) {
                console.log(err);
                return res.status(401).json({ message: "Invalid token" });
            }
        }
    }
}

module.exports = { verifyAdminJWT }