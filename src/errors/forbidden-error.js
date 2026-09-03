const AppError = require('./app-error');

class ForbiddenError extends AppError {
  constructor(i18nKey = 'errors.forbidden') {
    super(403, i18nKey);
  }
}

module.exports = ForbiddenError;
