const AppError = require('../errors/app-error');
const ValidationError = require('../errors/validation-error');
const { t } = require('../i18n/i18n.service');

function errorHandler(error, req, res, next) {
  const locale = req.locale || 'en';

  if (error instanceof ValidationError) {
    const fields = Object.fromEntries(
      Object.entries(error.fieldErrors).map(([field, key]) => [field, t(locale, key)]),
    );
    return res.status(error.status).json({ error: t(locale, error.i18nKey), fields });
  }

  if (error instanceof AppError) {
    return res.status(error.status).json({ error: t(locale, error.i18nKey, error.vars) });
  }

  console.error(error);
  return res.status(500).json({ error: t(locale, 'errors.internal') });
}

module.exports = errorHandler;
