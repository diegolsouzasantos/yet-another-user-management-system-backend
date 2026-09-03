const ForbiddenError = require('../../errors/forbidden-error');

function requireOwner(req, res, next) {
  if (!req.actor.isOwner) {
    return next(new ForbiddenError());
  }

  return next();
}

module.exports = requireOwner;
