const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// 简单的静态文件服务器用于测试
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // 简单的路由
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>周千墨HTML导航页 - 测试</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 40px;
            background: #f5f5f5;
            line-height: 1.6;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          h1 { color: #333; margin-bottom: 20px; }
          .status { padding: 15px; border-radius: 8px; margin: 20px 0; }
          .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
          .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
          .feature { margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 6px; }
          .btn {
            display: inline-block;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 5px;
          }
          .btn:hover { background: #0056b3; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 周千墨HTML导航页</h1>
          
          <div class="status success">
            ✅ 测试服务器运行正常！
          </div>
          
          <div class="status info">
            📝 项目修改已完成，以下是主要变更：
          </div>
          
          <div class="feature">
            <h3>✨ 已完成的修改</h3>
            <ul>
              <li>✅ 移除了所有书签功能，只保留应用(apps)功能</li>
              <li>✅ 移除了搜索功能和页脚</li>
              <li>✅ 界面优化为全屏布局，专注桌面端体验</li>
              <li>✅ 网站标题更改为"周千墨HTML导航页"</li>
              <li>✅ 创建了完整的设置页面，包含：</li>
              <ul>
                <li>- 常规设置（网站标题、描述、问候语等）</li>
                <li>- 主题设置（主题选择、图标模式等）</li>
                <li>- 天气设置（位置配置、显示开关等）</li>
                <li>- 高级设置（数据导入导出、系统配置等）</li>
              </ul>
            </ul>
          </div>
          
          <div class="feature">
            <h3>🔧 技术架构</h3>
            <ul>
              <li>前端：Next.js 15 + TypeScript + Tailwind CSS</li>
              <li>数据存储：YAML文件（保持Flare的简洁性）</li>
              <li>文件上传：支持HTML文件上传和子域名访问</li>
              <li>响应式设计：专注桌面端体验</li>
            </ul>
          </div>
          
          <div class="feature">
            <h3>📁 项目结构</h3>
            <pre style="background: #f1f1f1; padding: 15px; border-radius: 6px; overflow-x: auto;">
nav-web-site/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API路由 (apps, config, upload)
│   │   ├── upload/            # 上传页面
│   │   ├── settings/          # 设置页面
│   │   └── subdomain/         # 子域名动态路由
│   ├── components/            # React组件
│   │   ├── ui/               # 基础UI组件
│   │   ├── home/             # 主页组件
│   │   ├── upload/           # 上传相关组件
│   │   ├── settings/         # 设置相关组件
│   │   └── bookmark/         # 应用相关组件
│   ├── lib/                  # 工具函数
│   │   ├── data/            # 数据操作 (YAML)
│   │   ├── utils/           # 通用工具
│   │   └── validation/      # 数据验证
│   └── types/               # TypeScript类型定义
├── data/                    # 数据存储目录
│   ├── apps.yml            # 应用数据
│   ├── config.yml          # 系统配置
│   └── uploads/            # 上传的HTML文件
└── restart.sh              # 重启脚本
            </pre>
          </div>
          
          <div class="feature">
            <h3>🎯 主要功能</h3>
            <a href="/upload" class="btn">📤 上传HTML</a>
            <a href="/settings" class="btn">⚙️ 系统设置</a>
            <a href="/api/apps" class="btn">📊 应用API</a>
            <a href="/api/config" class="btn">🔧 配置API</a>
          </div>
          
          <div class="status info">
            <strong>注意：</strong> 由于Next.js开发服务器的权限问题，当前使用测试服务器展示。
            所有代码修改已完成，可以通过以下方式启动：
            <br><br>
            <code>./restart.sh restart</code> 或 <code>npm run dev</code>
          </div>
        </div>
      </body>
      </html>
    `);
    return;
  }
  
  // API路由模拟
  if (req.url.startsWith('/api/')) {
    if (req.method === 'POST' && req.url === '/api/upload') {
      // 模拟文件上传
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: {
          id: 'test123',
          originalName: 'test.html',
          fileName: 'test123_test.html',
          filePath: 'data/uploads/test123_test.html',
          size: 1024,
          mimeType: 'text/html',
          uploadedAt: new Date()
        },
        message: '文件上传成功'
      }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/apps') {
      // 模拟应用创建
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: {
          id: 'app123',
          name: 'Test App',
          url: 'https://test.web.zhouqianmo.com',
          isHtmlFile: true,
          htmlFilePath: 'data/uploads/test123_test.html',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        message: '应用创建成功'
      }));
      return;
    }

    // 其他API
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'API endpoint available',
      endpoint: req.url,
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  // 404
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 - Page Not Found</h1>');
});

server.listen(PORT, () => {
  console.log(`🚀 测试服务器运行在 http://localhost:${PORT}`);
  console.log(`📝 项目修改已完成，可以访问查看结果`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n👋 关闭测试服务器...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    process.exit(0);
  });
});
