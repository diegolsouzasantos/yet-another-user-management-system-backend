const { randomBytes } = require('crypto');
const env = require('../../config/env');
const repository = require('./password-reset.repository');
const hashToken = require('./hash-token');
const { hashPassword } = require('./password.service');
const { sendPasswordResetEmail } = require('../../email/email.service');
const { recordChange } = require('../../audit/audit-log.service');
const UnauthorizedError = require('../../errors/unauthorized-error');
const { RESET_TOKEN_TTL_MINUTES, RESET_PATH } = require('../../config/constants/password-reset.constants');

async function requestReset(email, locale) {
  const user = await repository.findUserByEmail(email);
  if (!user) return;

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);
  await repository.createResetToken(user.id, hashToken(token), expiresAt);

  const resetUrl = `${env.APP_WEB_URL}${RESET_PATH}?token=${token}`;
  await sendPasswordResetEmail({ to: user.email, resetUrl, locale });
}

async function confirmReset(token, newPassword) {
  const record = await repository.findActiveResetToken(hashToken(token));
  if (!record) {
    throw new UnauthorizedError('errors.reset_token_invalid');
  }

  await repository.applyReset(record, await hashPassword(newPassword));
  await recordChange(record.userId, 'User', record.userId, [
    { field: 'passwordHash', oldValue: null, newValue: 'reset' },
  ]);
}

module.exports = { requestReset, confirmReset };
