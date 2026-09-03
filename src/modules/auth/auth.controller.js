const authService = require('./auth.service');
const passwordReset = require('./password-reset.service');
const { sendSuccess } = require('../../utils/response.util');
const toPublicUser = require('../../utils/to-public-user');

async function login(req, res) {
  const { email, password } = req.body;
  const { user, tokens } = await authService.login(email, password);
  return sendSuccess(res, { user: toPublicUser(user), ...tokens });
}

async function refresh(req, res) {
  const tokens = await authService.refresh(req.body.refreshToken);
  return sendSuccess(res, tokens);
}

async function logout(req, res) {
  await authService.logout(req.body.refreshToken);
  return sendSuccess(res, { success: true });
}

async function me(req, res) {
  const permissions = Array.from(req.actor.permissionSet);
  return sendSuccess(res, { user: toPublicUser(req.actorUser), grantsAll: req.actor.grantsAll, permissions });
}

async function forgotPassword(req, res) {
  await passwordReset.requestReset(req.body.email, req.locale);
  return sendSuccess(res, { success: true });
}

async function resetPassword(req, res) {
  await passwordReset.confirmReset(req.body.token, req.body.password);
  return sendSuccess(res, { success: true });
}

module.exports = { login, refresh, logout, me, forgotPassword, resetPassword };
