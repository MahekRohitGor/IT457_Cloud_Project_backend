const {createProxyMiddleware} = require("http-proxy-middleware");

function proxy(path, target, extraOpts = {}){
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        logLevel: "debug",
        ...extraOpts,
    });
}

module.exports = {proxy};