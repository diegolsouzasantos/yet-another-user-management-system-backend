const hasPermission = require('../../rbac/permission-check.service');
const ForbiddenError = require('../../errors/forbidden-error');
const asyncHandler = require('../../utils/async-handler');

function requirePermission(resource, action, { loadTarget } = {}) {
  return asyncHandler(async (req, res, next) => {
    const target = loadTarget ? await loadTarget(req) : null;

    if (!hasPermission(req.actor, resource, action, target)) {
      throw new ForbiddenError();
    }

    req.target = target;
    next();
  });
}

module.exports = requirePermission;
