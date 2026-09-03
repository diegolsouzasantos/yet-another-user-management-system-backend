const { Router } = require('express');
const requirePermission = require('../../middleware/authorize/require-permission.middleware');
const validate = require('../../middleware/validate.middleware');
const asyncHandler = require('../../utils/async-handler');
const grantSchema = require('../../validation/schemas/permission-grant.schema');
const { requireTargetUser } = require('./load-target-user');
const controller = require('./user-permissions.controller');

const router = Router({ mergeParams: true });

router.post(
  '/',
  validate(grantSchema.grant),
  requirePermission('permissions', 'grant'),
  requireTargetUser,
  asyncHandler(controller.grant),
);

router.delete(
  '/:permissionId',
  validate(grantSchema.params, 'params'),
  requirePermission('permissions', 'revoke'),
  requireTargetUser,
  asyncHandler(controller.revoke),
);

module.exports = router;
