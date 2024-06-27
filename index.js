const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 配置反向代理中间件
app.use('/', createProxyMiddleware({
    target: 'https://www.baidu.com',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        // 修改请求头，确保目标服务器正确处理请求
        proxyReq.setHeader('Host', 'www.baidu.com');
    },
    onProxyRes: (proxyRes, req, res) => {
        // 允许跨域请求
        res.setHeader('Access-Control-Allow-Origin', '*');
    },
    onError: (err, req, res) => {
        res.status(500).send('Something went wrong.');
    }
}));

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
