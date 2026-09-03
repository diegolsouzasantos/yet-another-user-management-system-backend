const AppError = require('./app-error');

class ConflictError extends AppError {
  constructor(i18nKey = 'errors.conflict') {
    super(409, i18nKey);
  }
}

module.exports = ConflictError;
