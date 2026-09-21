import './env.js';
import express from 'express';
import path from 'node:path';
import { hasApiKey } from './anthropic.js';
import { app } from './app.js';

// Local server: the API from app.ts plus the React app (Vite in dev, dist/ in production).
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
} else {
  const distDir = path.resolve('dist');
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distDir, 'index.html'));
    }
    next();
  });
}


const port = Number(process.env.PORT) || 5173;
app.listen(port, () => {
  console.log(
    `Tully Operating System — http://localhost:${port} (live drafting: ${
      hasApiKey() ? 'on' : 'off'
    })`,
  );
});

