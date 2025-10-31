function errorHandler(err, req, res, next){
    console.error('[API-GATEWAY ERROR]', err.stack || err);
    const status = err.status || 500;
    const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
    res.status(status).json({ error: message });
}

module.exports = { errorHandler };