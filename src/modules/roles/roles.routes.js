const { Router } = require('express');
const authenticate = require('../../middleware/authenticate.middleware');
const requirePermission = require('../../middleware/authorize/require-permission.middleware');
const validate = require('../../middleware/validate.middleware');
const asyncHandler = require('../../utils/async-handler');
const roleSchema = require('../../validation/schemas/role.schema');
const listQuery = require('../../validation/schemas/list-query.schema');
const bulkDeleteSchema = require('../../validation/schemas/bulk-delete.schema');
const { ROLES } = require('../../config/constants/sort-fields.constants');
const { ROLES: ROLES_FILTERS } = require('../../config/constants/filter-fields.constants');
const { makeExportHandler } = require('../../exports/export.handler');
const resourceExports = require('../../exports/resource-exports');
const { requireTargetRole } = require('./load-target-role');
const rolePermissionsRouter = require('./role-permissions.routes');
const controller = require('./roles.controller');

const router = Router();
router.use(authenticate);

const listValidation = validate(listQuery(ROLES, ROLES_FILTERS), 'query');

router.get('/', listValidation, requirePermission('roles', 'read'), asyncHandler(controller.list));
router.get('/export', listValidation, requirePermission('roles', 'read'), asyncHandler(makeExportHandler(resourceExports.roles)));
router.delete('/', validate(bulkDeleteSchema), requirePermission('roles', 'delete'), asyncHandler(controller.bulkRemove));

router.get(
  '/:id',
  validate(roleSchema.params, 'params'),
  requirePermission('roles', 'read'),
  requireTargetRole,
  asyncHandler(controller.getById),
);

router.post('/', validate(roleSchema.create), requirePermission('roles', 'create'), asyncHandler(controller.create));

router.patch(
  '/:id',
  validate(roleSchema.params, 'params'),
  validate(roleSchema.update),
  requirePermission('roles', 'update'),
  requireTargetRole,
  asyncHandler(controller.update),
);

router.delete(
  '/:id',
  validate(roleSchema.params, 'params'),
  requirePermission('roles', 'delete'),
  requireTargetRole,
  asyncHandler(controller.remove),
);

router.use('/:id/permissions', rolePermissionsRouter);

module.exports = router;
