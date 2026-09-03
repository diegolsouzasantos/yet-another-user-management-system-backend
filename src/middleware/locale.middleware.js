const { SUPPORTED_LOCALES, DEFAULT_LOCALE } = require('../config/constants/locales.constants');

function pickLocale(req) {
  const requested = req.query.locale || req.headers['x-locale'];
  return SUPPORTED_LOCALES.includes(requested) ? requested : DEFAULT_LOCALE;
}

function locale(req, res, next) {
  req.locale = pickLocale(req);
  next();
}

module.exports = locale;
