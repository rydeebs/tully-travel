// Vercel Function: every /api/* request is rewritten here (see vercel.json) and handled by the
// same Express app the local server uses. Static files are served by Vercel from dist/.
import { app } from '../server/app.js';

export default app;
