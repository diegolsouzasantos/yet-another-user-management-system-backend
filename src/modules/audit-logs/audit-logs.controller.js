const service = require('./audit-logs.service');
const { sendSuccess } = require('../../utils/response.util');

async function list(req, res) {
  const { rows, meta } = await service.list(req.query);
  return sendSuccess(res, { auditLogs: rows, meta });
}

module.exports = { list };
