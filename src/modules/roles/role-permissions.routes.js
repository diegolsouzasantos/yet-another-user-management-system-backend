const { Router } = require('express');
const requirePermission = require('../../middleware/authorize/require-permission.middleware');
const validate = require('../../middleware/validate.middleware');
const asyncHandler = require('../../utils/async-handler');
const membershipSchema = require('../../validation/schemas/membership.schema');
const { requireTargetRole } = require('./load-target-role');
const controller = require('./role-permissions.controller');

const router = Router({ mergeParams: true });

router.post(
  '/',
  validate(membershipSchema.addPermissions),
  requirePermission('roles', 'update'),
  requireTargetRole,
  asyncHandler(controller.add),
);

router.delete(
  '/:permissionId',
  validate(membershipSchema.permissionParams, 'params'),
  requirePermission('roles', 'update'),
  requireTargetRole,
  asyncHandler(controller.remove),
);

module.exports = router;
