const { Op } = require('sequelize');
const db = require('../../db/models');

function findUserByEmail(email) {
  return db.User.findOne({ where: { email } });
}

function createResetToken(userId, tokenHash, expiresAt) {
  return db.PasswordResetToken.create({ userId, tokenHash, expiresAt });
}

function findActiveResetToken(tokenHash) {
  return db.PasswordResetToken.findOne({
    where: { tokenHash, usedAt: null, expiresAt: { [Op.gt]: new Date() } },
  });
}

async function applyReset(record, passwordHash) {
  await db.sequelize.transaction(async (transaction) => {
    await db.User.update({ passwordHash }, { where: { id: record.userId }, transaction });
    await record.update({ usedAt: new Date() }, { transaction });
    await db.RefreshToken.update(
      { revokedAt: new Date() },
      { where: { userId: record.userId, revokedAt: null }, transaction },
    );
  });
}

module.exports = { findUserByEmail, createResetToken, findActiveResetToken, applyReset };
