class AppError extends Error {
  constructor(status, i18nKey, vars = {}) {
    super(i18nKey);
    this.status = status;
    this.i18nKey = i18nKey;
    this.vars = vars;
  }
}

module.exports = AppError;
