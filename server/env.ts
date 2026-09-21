/* Loaded first so .env values exist before any other module reads process.env. */
try {
  process.loadEnvFile('.env');
} catch {
  // A local .env is optional; exported shell variables work too.
}
