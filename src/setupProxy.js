const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
    app.use(
        "/api",
        createProxyMiddleware( {
            // TODO: 로컬 사용 시 Chat.js 30번째 줄 url 사용
            // target: 'http://localhost:8080',
            target: 'http://52.78.94.86:8080',
            pathRewrite: {
                '^/api':''
            },
            changeOrigin: true,
        })
    )


};