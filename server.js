import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import winston from 'winston';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// LOGGING CONFIGURATION
// ============================================================================
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'app',
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  },
  transports: [
    new winston.transports.File({ 
      filename: `logs/error.log`, 
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: `logs/combined.log`,
      maxsize: 10485760,
      maxFiles: 5
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

const app = express();
const PORT = process.env.PORT || 3000;
const API = process.env.API_URL || 'http://api:8080';

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    
    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: duration,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });
  
  next();
});

// Instead of app.use('/api', ...), you can pass the path inside the middleware config
app.use(createProxyMiddleware({
  pathFilter: '/api',
  target: API,
  changeOrigin: true,
  onError: (err, req, res) => {
    logger.error('Proxy error', {
      error: err.message,
      path: req.path,
      target: API
    });
  },
  onProxyReq: (proxyReq, req) => {
    logger.debug('Proxying request', {
      method: req.method,
      path: req.path,
      target: API
    });
  }
}));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist/people-app/browser')));

// Handle Angular routing - return index.html for all routes
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/people-app/browser/index.html'));
});

app.listen(PORT, () => {
  logger.info('Server started successfully', {
    port: PORT,
    environment: process.env.NODE_ENV,
    apiUrl: API,
    nodeVersion: process.version,
    pid: process.pid
  });
});