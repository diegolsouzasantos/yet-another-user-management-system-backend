const { DEFAULT_LOCALE } = require('../config/constants/locales.constants');
const loadLocaleFile = require('./load-locale-file');
const interpolate = require('./interpolate');

function resolveTemplate(locale, namespace, key) {
  const bundle = loadLocaleFile(locale, namespace);
  return bundle[key];
}

function t(locale, i18nKey, vars = {}) {
  const [namespace, key] = i18nKey.split('.');
  const template = resolveTemplate(locale, namespace, key)
    || resolveTemplate(DEFAULT_LOCALE, namespace, key)
    || i18nKey;

  return interpolate(template, vars);
}

module.exports = { t };
