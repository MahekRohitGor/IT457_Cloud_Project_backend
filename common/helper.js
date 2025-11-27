const { createProxyMiddleware } = require("http-proxy-middleware");

function proxy(target) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    logLevel: "debug",
    onProxyReq: (proxyReq, req, res) => {
      console.log("FORWARDING →", proxyReq.path);
      if (
        req.body &&
        Object.keys(req.body).length > 0 &&
        req.headers["content-type"]?.includes("application/json")
      ) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  });
}

module.exports = { proxy };