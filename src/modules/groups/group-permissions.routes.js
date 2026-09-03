const { Router } = require('express');
const requirePermission = require('../../middleware/authorize/require-permission.middleware');
const validate = require('../../middleware/validate.middleware');
const asyncHandler = require('../../utils/async-handler');
const membershipSchema = require('../../validation/schemas/membership.schema');
const { requireTargetGroup } = require('./load-target-group');
const controller = require('./group-permissions.controller');

const router = Router({ mergeParams: true });

router.post(
  '/',
  validate(membershipSchema.addPermissions),
  requirePermission('groups', 'update'),
  requireTargetGroup,
  asyncHandler(controller.add),
);

router.delete(
  '/:permissionId',
  validate(membershipSchema.permissionParams, 'params'),
  requirePermission('groups', 'update'),
  requireTargetGroup,
  asyncHandler(controller.remove),
);

module.exports = router;
