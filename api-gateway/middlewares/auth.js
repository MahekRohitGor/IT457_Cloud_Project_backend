const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next){
    const auth = req.header('Authorization') || '';
    const token = auth.startswith('Bearer ') ? auth.slice(7) : null;
    if(!token) return res.status(401).json({ error: 'Authorization token is required' });
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch(err){
        console.log(err);
        console.log(err.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = {verifyJWT}