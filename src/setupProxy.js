const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
    app.use(
        "/api",
        createProxyMiddleware( {
            // TODO: 로컬 사용 시 Chat.js 30번째 줄 url 사용
            target: process.env.REACT_APP_API_KEY,
            pathRewrite: {
                '^/api':''
            },
            changeOrigin: true,
        })
    )


};