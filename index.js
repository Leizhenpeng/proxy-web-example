const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const cheerio = require('cheerio');

const app = express();
const targetUrl = 'https://www.metaso.cn';

// 配置反向代理中间件
app.use('/', createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    selfHandleResponse: true,
    on: {
        proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');

            const contentType = proxyRes.headers['content-type'];
            if (contentType && contentType.includes('text/html')) {
                const $ = cheerio.load(responseBuffer.toString('utf8'));
                $('body').css('opacity', '0.9'); // 修改透明度为10%
                return $.html();
            }
            return responseBuffer;
        }),
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers['Referer'] = targetUrl;
            proxyReqOpts.headers['Origin'] = targetUrl;
            proxyReqOpts.headers['Host'] = new URL(targetUrl).host;
            // 可以根据需要修改 User-Agent
            proxyReqOpts.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';
            return proxyReqOpts;
        },
    },
}));

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
