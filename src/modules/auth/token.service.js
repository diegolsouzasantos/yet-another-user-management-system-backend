const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const { ALGORITHM, ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL_DAYS } = require('../../config/constants/jwt.constants');

function signAccessToken(user) {
  const payload = { sub: user.id, roleId: user.roleId, isOwner: user.isOwner };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { algorithm: ALGORITHM, expiresIn: ACCESS_TOKEN_TTL });
}

function signRefreshToken(user) {
  const payload = { sub: user.id };
  const expiresIn = `${REFRESH_TOKEN_TTL_DAYS}d`;
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { algorithm: ALGORITHM, expiresIn });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };
