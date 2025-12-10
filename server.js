import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const API = process.env.API_URL || 'http://api:8080';

// Instead of app.use('/api', ...), you can pass the path inside the middleware config
app.use(createProxyMiddleware({
  pathFilter: '/api', // Only proxy requests starting with /api
  target: API,
  changeOrigin: true,
  // No pathRewrite needed because app.use is mounted on root ('/') 
  // so Express doesn't strip anything!
}));

// Use below configuration when to rewrite paths and strip out /api
// Proxy API requests to the backend
// app.use('/api', createProxyMiddleware({
//   target: 'http://localhost:8080',
//   changeOrigin: true,
//   pathRewrite: { '': '/api' },
//   logLevel: 'debug' // Remove in production
// }));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist/people-app/browser')));

// Handle Angular routing - return index.html for all routes
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/people-app/browser/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});