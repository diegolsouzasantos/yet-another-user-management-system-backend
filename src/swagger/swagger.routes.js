const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

function loadSpec() {
  const filePath = path.join(__dirname, '..', '..', 'openapi', 'openapi.yaml');
  return yaml.load(fs.readFileSync(filePath, 'utf8'));
}

function mountSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(loadSpec()));
}

module.exports = mountSwagger;
