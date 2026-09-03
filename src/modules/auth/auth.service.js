const repository = require('./auth.repository');
const { comparePassword } = require('./password.service');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('./token.service');
const hashToken = require('./hash-token');
const UnauthorizedError = require('../../errors/unauthorized-error');

async function issueTokens(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await repository.storeRefreshToken(user.id, hashToken(refreshToken));
  return { accessToken, refreshToken };
}

async function login(email, password) {
  const user = await repository.findUserByEmail(email);
  const matches = user && await comparePassword(password, user.passwordHash);

  if (!matches) {
    throw new UnauthorizedError('errors.invalid_credentials');
  }

  return { user, tokens: await issueTokens(user) };
}

async function refresh(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new UnauthorizedError();
  }

  const stored = await repository.findActiveRefreshToken(hashToken(refreshToken));
  if (!stored) {
    throw new UnauthorizedError();
  }

  await repository.revokeRefreshToken(stored);
  const user = await repository.findUserById(payload.sub);
  return issueTokens(user);
}

async function logout(refreshToken) {
  const stored = await repository.findActiveRefreshToken(hashToken(refreshToken));
  if (stored) {
    await repository.revokeRefreshToken(stored);
  }
}

module.exports = { login, refresh, logout };
