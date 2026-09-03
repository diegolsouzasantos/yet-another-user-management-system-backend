const env = require('./config/env');
const app = require('./app');
const runStartup = require('./bootstrap/startup');

async function main() {
  await runStartup();

  app.listen(env.PORT, () => {
    console.log(`yaUMS backend listening on port ${env.PORT}`);
  });
}

main().catch((error) => {
  console.error('Fatal error during startup:', error);
  process.exit(1);
});
