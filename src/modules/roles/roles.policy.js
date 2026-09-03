const ForbiddenError = require('../../errors/forbidden-error');

function assertNotSystemRole(role) {
  if (role.isSystemRole) {
    throw new ForbiddenError();
  }
}

module.exports = { assertNotSystemRole };
