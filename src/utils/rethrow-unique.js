const ConflictError = require('../errors/conflict-error');

function rethrowUniqueAs(i18nKey) {
  return (error) => {
    if (error && error.name === 'SequelizeUniqueConstraintError') {
      throw new ConflictError(i18nKey);
    }
    throw error;
  };
}

module.exports = rethrowUniqueAs;
