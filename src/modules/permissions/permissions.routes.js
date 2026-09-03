const { Router } = require('express');
const authenticate = require('../../middleware/authenticate.middleware');
const requirePermission = require('../../middleware/authorize/require-permission.middleware');
const validate = require('../../middleware/validate.middleware');
const asyncHandler = require('../../utils/async-handler');
const permissionSchema = require('../../validation/schemas/permission.schema');
const listQuery = require('../../validation/schemas/list-query.schema');
const { PERMISSIONS } = require('../../config/constants/sort-fields.constants');
const { PERMISSIONS: PERMISSIONS_FILTERS } = require('../../config/constants/filter-fields.constants');
const { requireTargetPermission } = require('./load-target-permission');
const controller = require('./permissions.controller');

const router = Router();
router.use(authenticate);

router.get(
  '/',
  validate(listQuery(PERMISSIONS, PERMISSIONS_FILTERS), 'query'),
  requirePermission('permissions', 'read'),
  asyncHandler(controller.list),
);

router.get(
  '/:id',
  validate(permissionSchema.params, 'params'),
  requirePermission('permissions', 'read'),
  requireTargetPermission,
  asyncHandler(controller.getById),
);

module.exports = router;
