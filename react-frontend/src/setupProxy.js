const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api', // 保持 API 路徑不變
      },
      onError: (err, req, res) => {
        console.warn('API proxy error:', err);
        
        // 根據請求路徑返回模擬數據
        if (req.path.includes('/auth/user')) {
          res.json({
            success: true,
            user: {
              id: 1,
              username: '測試用戶',
              email: 'test@example.com',
              createdAt: '2025-01-01T00:00:00Z'
            }
          });
        } else if (req.path.includes('/auth/points')) {
          res.json({
            success: true,
            balance: 10.0
          });
        } else if (req.path.includes('/settings')) {
          res.json({
            success: true,
            settings: {
              apiKey: 'sk-mock-key',
              model: 'gpt-3.5-turbo',
              temperature: 0.7,
              maxTokens: 2000
            }
          });
        } else {
          res.status(500).json({
            success: false,
            message: '無法連接到 API 服務器'
          });
        }
      }
    })
  );
};
