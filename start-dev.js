const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 清理.next目录
const nextDir = path.join(__dirname, '.next');
if (fs.existsSync(nextDir)) {
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('✓ 清理 .next 目录');
  } catch (error) {
    console.log('⚠ 无法清理 .next 目录:', error.message);
  }
}

// 启动开发服务器
console.log('🚀 启动开发服务器...');
const child = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: '1'
  }
});

child.on('error', (error) => {
  console.error('启动失败:', error);
});

child.on('exit', (code) => {
  console.log(`开发服务器退出，代码: ${code}`);
});
