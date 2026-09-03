const { hashPassword } = require('../auth/password.service');

async function applyPasswordUpdate(payload) {
  if (!payload.password) {
    return payload;
  }

  const { password, ...rest } = payload;
  return { ...rest, passwordHash: await hashPassword(password) };
}

module.exports = applyPasswordUpdate;
