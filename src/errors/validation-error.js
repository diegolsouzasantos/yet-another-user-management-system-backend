const AppError = require('./app-error');

class ValidationError extends AppError {
  constructor(fieldErrors) {
    super(422, 'errors.validation_failed');
    this.fieldErrors = fieldErrors;
  }
}

module.exports = ValidationError;
