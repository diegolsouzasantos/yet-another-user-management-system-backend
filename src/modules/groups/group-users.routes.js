const { Router } = require('express');
const requirePermission = require('../../middleware/authorize/require-permission.middleware');
const validate = require('../../middleware/validate.middleware');
const asyncHandler = require('../../utils/async-handler');
const membershipSchema = require('../../validation/schemas/membership.schema');
const { requireTargetGroup } = require('./load-target-group');
const controller = require('./group-users.controller');

const router = Router({ mergeParams: true });

router.post(
  '/',
  validate(membershipSchema.addUsers),
  requirePermission('groups', 'update'),
  requireTargetGroup,
  asyncHandler(controller.add),
);

router.delete(
  '/:userId',
  validate(membershipSchema.userParams, 'params'),
  requirePermission('groups', 'update'),
  requireTargetGroup,
  asyncHandler(controller.remove),
);

module.exports = router;
