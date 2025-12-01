const {encryptData} = require('../utils/cryptoUtils');

function verifyUser(req, res, next) {
    console.log("Inside Verify User Middleware");
    const user_id = req.headers["x-user-id"];
    if (!user_id) {
        return res.status(400).json({
            payload: encryptData({
                code: 400,
                message: "User ID is required in 'x-user-id' header",
                data: null
            })
        });
    } else {
        console.log("Verified User ID:", user_id);
        req.user_id = Number(user_id);
        next();
    }
}

module.exports = { verifyUser };