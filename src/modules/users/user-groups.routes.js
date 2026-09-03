const { Router } = require('express');
const requirePermission = require('../../middleware/authorize/require-permission.middleware');
const validate = require('../../middleware/validate.middleware');
const asyncHandler = require('../../utils/async-handler');
const membershipSchema = require('../../validation/schemas/membership.schema');
const { fetchTarget, requireTargetUser } = require('./load-target-user');
const controller = require('./user-groups.controller');

const router = Router({ mergeParams: true });

router.post(
  '/',
  validate(membershipSchema.addGroups),
  requirePermission('users', 'update', { loadTarget: fetchTarget }),
  requireTargetUser,
  asyncHandler(controller.add),
);

router.delete(
  '/:groupId',
  validate(membershipSchema.groupParams, 'params'),
  requirePermission('users', 'update', { loadTarget: fetchTarget }),
  requireTargetUser,
  asyncHandler(controller.remove),
);

module.exports = router;
