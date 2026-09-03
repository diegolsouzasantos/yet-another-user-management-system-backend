const db = require('../../db/models');
const { REFRESH_TOKEN_TTL_DAYS } = require('../../config/constants/jwt.constants');

function findUserByEmail(email) {
  return db.User.findOne({ where: { email }, include: [db.Role] });
}

function findUserById(id) {
  return db.User.findByPk(id, { include: [db.Role] });
}

function storeRefreshToken(userId, tokenHash) {
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  return db.RefreshToken.create({ userId, tokenHash, expiresAt });
}

function findActiveRefreshToken(tokenHash) {
  return db.RefreshToken.findOne({ where: { tokenHash, revokedAt: null } });
}

function revokeRefreshToken(tokenRecord) {
  return tokenRecord.update({ revokedAt: new Date() });
}

module.exports = {
  findUserByEmail, findUserById, storeRefreshToken, findActiveRefreshToken, revokeRefreshToken,
};
