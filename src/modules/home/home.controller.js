const { sendSuccess } = require('../../utils/response.util');
const toPublicUser = require('../../utils/to-public-user');

function get(req, res) {
  return sendSuccess(res, { user: toPublicUser(req.actorUser) });
}

module.exports = { get };
