const service = require('./groups.service');
const toGroupDetail = require('../../utils/to-group-detail');
const { sendSuccess, sendCreated, sendNoContent } = require('../../utils/response.util');

async function list(req, res) {
  const { rows, meta } = await service.list(req.query);
  return sendSuccess(res, { groups: rows, meta });
}

async function getById(req, res) {
  return sendSuccess(res, { group: toGroupDetail(req.target) });
}

async function create(req, res) {
  const group = await service.create(req.actor, req.body);
  return sendCreated(res, { group });
}

async function update(req, res) {
  const group = await service.update(req.actor, req.target, req.body);
  return sendSuccess(res, { group });
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
