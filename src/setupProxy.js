const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
    app.use(
        "/api",
        createProxyMiddleware( {
            // target: 'http://localhost:8080',
            target: 'http://52.78.94.86:8080',
            pathRewrite: {
                '^/api':''
            },
            changeOrigin: true,
        })
    )

    app.use(
        "/ws-stomp",
        createProxyMiddleware({ target: "http://localhost:8080", pathRewrite: { '^/ws-stomp':'' }, ws: true })
    );
};