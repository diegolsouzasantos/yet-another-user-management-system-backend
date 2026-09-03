const AppError = require('./app-error');

class NotFoundError extends AppError {
  constructor(i18nKey = 'errors.not_found') {
    super(404, i18nKey);
  }
}

module.exports = NotFoundError;
