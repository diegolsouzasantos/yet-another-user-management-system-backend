const service = require('./permissions.service');
const { sendSuccess } = require('../../utils/response.util');

async function list(req, res) {
  const { rows, meta } = await service.list(req.query);
  return sendSuccess(res, { permissions: rows, meta });
}

async function getById(req, res) {
  return sendSuccess(res, { permission: req.target });
}

module.exports = { list, getById };
