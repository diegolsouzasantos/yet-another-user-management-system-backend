const service = require('./users.service');
const { canViewUser } = require('./users.policy');
const { sendSuccess, sendCreated, sendNoContent } = require('../../utils/response.util');
const toPublicUser = require('../../utils/to-public-user');
const toUserDetail = require('../../utils/to-user-detail');
const ForbiddenError = require('../../errors/forbidden-error');

async function list(req, res) {
  const { rows, meta } = await service.list(req.query);
  return sendSuccess(res, { users: rows.map(toPublicUser), meta });
}

async function getById(req, res) {
  if (!canViewUser(req.actor, req.target)) {
    throw new ForbiddenError();
  }
  return sendSuccess(res, { user: toUserDetail(req.target) });
}

async function create(req, res) {
  const user = await service.create(req.actor, req.body);
  return sendCreated(res, { user: toPublicUser(user) });
}

async function update(req, res) {
  const user = await service.update(req.actor, req.target, req.body);
  return sendSuccess(res, { user: toPublicUser(user) });
}

async function remove(req, res) {
  await service.remove(req.actor, req.target);
  return sendNoContent(res);
}

async function bulkRemove(req, res) {
  const result = await service.bulkRemove(req.actor, req.body.ids);
  return sendSuccess(res, result);
}

module.exports = { list, getById, create, update, remove, bulkRemove };
