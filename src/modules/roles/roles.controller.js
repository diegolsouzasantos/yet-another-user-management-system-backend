const service = require('./roles.service');
const toRoleDetail = require('../../utils/to-role-detail');
const { sendSuccess, sendCreated, sendNoContent } = require('../../utils/response.util');

async function list(req, res) {
  const { rows, meta } = await service.list(req.query);
  return sendSuccess(res, { roles: rows, meta });
}

async function getById(req, res) {
  return sendSuccess(res, { role: toRoleDetail(req.target) });
}

async function create(req, res) {
  const role = await service.create(req.actor, req.body);
  return sendCreated(res, { role });
}

async function update(req, res) {
  const role = await service.update(req.actor, req.target, req.body);
  return sendSuccess(res, { role });
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
