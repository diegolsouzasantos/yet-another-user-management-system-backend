const AppError = require('./app-error');

class UnauthorizedError extends AppError {
  constructor(i18nKey = 'errors.unauthorized') {
    super(401, i18nKey);
  }
}

module.exports = UnauthorizedError;
