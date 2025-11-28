const {encryptData, decryptData} = require('../utils/cryptoUtils');

function decryptMiddleware(req, res, next){
    try{
        if(req.body?.payload){
            const decrypted = decryptData(req.body.payload);
            req.dcryptbody = decrypted;
        } else{
            req.dcryptbody = {};
        }
        next();
    } catch(error){
        console.log('Decryption Middleware Error:', error);
        res.status(400).json(
            { payload:
                encryptData({
                    code: 400,
                    message: "decryption failed",
                    data: null
                })
            }
        );
    }
}

function encryptedMiddleware(handler){
    return async(req, res) => {
        try{
            const response = await handler(req, res, req.dcryptbody);
            console.log('Handler Response:', response);
            res.status(response.code || 200).json({payload: encryptData(response)});
        } catch(error){
            console.log('Encryption Middleware Error:', error);
            res.status(500).json(
                {payload: 
                    encryptData(
                        {
                            code: 500,
                            message: "Internal Server Error",
                            data: null
                        })
                }
            );
        }
    }
}

module.exports = {
    decryptMiddleware,
    encryptedMiddleware
}