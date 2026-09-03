const fs = require('fs');
const path = require('path');

const cache = new Map();

function loadLocaleFile(locale, namespace) {
  const cacheKey = `${locale}:${namespace}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const filePath = path.join(__dirname, 'locales', locale, `${namespace}.json`);
  const content = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, 'utf8'))
    : {};

  cache.set(cacheKey, content);
  return content;
}

module.exports = loadLocaleFile;
