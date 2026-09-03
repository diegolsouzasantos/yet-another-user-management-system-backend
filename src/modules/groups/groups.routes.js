const { Router } = require('express');
const authenticate = require('../../middleware/authenticate.middleware');
const requirePermission = require('../../middleware/authorize/require-permission.middleware');
const validate = require('../../middleware/validate.middleware');
const asyncHandler = require('../../utils/async-handler');
const groupSchema = require('../../validation/schemas/group.schema');
const listQuery = require('../../validation/schemas/list-query.schema');
const bulkDeleteSchema = require('../../validation/schemas/bulk-delete.schema');
const { GROUPS } = require('../../config/constants/sort-fields.constants');
const { GROUPS: GROUPS_FILTERS } = require('../../config/constants/filter-fields.constants');
const { makeExportHandler } = require('../../exports/export.handler');
const resourceExports = require('../../exports/resource-exports');
const { requireTargetGroup } = require('./load-target-group');
const groupUsersRouter = require('./group-users.routes');
const groupPermissionsRouter = require('./group-permissions.routes');
const controller = require('./groups.controller');

const router = Router();
router.use(authenticate);

const listValidation = validate(listQuery(GROUPS, GROUPS_FILTERS), 'query');

router.get('/', listValidation, requirePermission('groups', 'read'), asyncHandler(controller.list));
router.get('/export', listValidation, requirePermission('groups', 'read'), asyncHandler(makeExportHandler(resourceExports.groups)));
router.delete('/', validate(bulkDeleteSchema), requirePermission('groups', 'delete'), asyncHandler(controller.bulkRemove));

router.get(
  '/:id',
  validate(groupSchema.params, 'params'),
  requirePermission('groups', 'read'),
  requireTargetGroup,
  asyncHandler(controller.getById),
);

router.post('/', validate(groupSchema.create), requirePermission('groups', 'create'), asyncHandler(controller.create));

router.patch(
  '/:id',
  validate(groupSchema.params, 'params'),
  validate(groupSchema.update),
  requirePermission('groups', 'update'),
  requireTargetGroup,
  asyncHandler(controller.update),
);

router.delete(
  '/:id',
  validate(groupSchema.params, 'params'),
  requirePermission('groups', 'delete'),
  requireTargetGroup,
  asyncHandler(controller.remove),
);

router.use('/:id/users', groupUsersRouter);
router.use('/:id/permissions', groupPermissionsRouter);

module.exports = router;
