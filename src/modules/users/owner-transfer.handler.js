const ownerTransfer = require('../../rbac/owner-transfer.service');
const { sendSuccess } = require('../../utils/response.util');
const toPublicUser = require('../../utils/to-public-user');

async function transfer(req, res) {
  const target = await ownerTransfer({ currentOwner: req.actorUser, ...req.body });
  return sendSuccess(res, { user: toPublicUser(target) });
}

module.exports = transfer;
