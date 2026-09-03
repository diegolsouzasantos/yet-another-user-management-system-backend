const { verifyAccessToken } = require('../modules/auth/token.service');
const loadActor = require('../rbac/load-actor');
const resolveActorPermissions = require('../rbac/resolve-actor-permissions');
const UnauthorizedError = require('../errors/unauthorized-error');
const asyncHandler = require('../utils/async-handler');

function extractToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  return scheme === 'Bearer' ? token : null;
}

const authenticate = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    throw new UnauthorizedError();
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    throw new UnauthorizedError();
  }

  const user = await loadActor(payload.sub);
  if (!user || !user.isActive) {
    throw new UnauthorizedError();
  }

  req.actorUser = user;
  req.actor = resolveActorPermissions(user);
  next();
});

module.exports = authenticate;
