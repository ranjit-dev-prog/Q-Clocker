const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

function waitForHealth(timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get('http://127.0.0.1:3000/api/v1/health', (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          setTimeout(check, 300);
        }
      });
      req.on('error', (err) => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Server failed to start within ${timeoutMs}ms: ${err.message}`));
        } else {
          setTimeout(check, 300);
        }
      });
    };
    check();
  });
}

async function withRunningServer(testFn) {
  const backendDir = path.resolve(__dirname, '../../backend');
  console.log('Starting backend server for test session from:', backendDir);
  const serverProc = spawn('node', ['dist/src/main.js'], {
    cwd: backendDir,
    stdio: ['inherit', 'pipe', 'pipe'],
    env: { ...process.env, PORT: '3000' },
  });

  serverProc.stdout.on('data', (d) => {
    process.stdout.write('[NEST] ' + d.toString());
  });

  serverProc.stderr.on('data', (d) => {
    process.stderr.write('[NEST ERR] ' + d.toString());
  });

  try {
    await waitForHealth(20000);
    console.log('Backend server is healthy and ready on http://127.0.0.1:3000/api/v1');
    await testFn();
  } finally {
    console.log('Shutting down backend server harness...');
    serverProc.kill();
  }
}

module.exports = { withRunningServer };
