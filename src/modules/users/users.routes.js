const { Router } = require('express');
const authenticate = require('../../middleware/authenticate.middleware');
const requirePermission = require('../../middleware/authorize/require-permission.middleware');
const requireOwner = require('../../middleware/authorize/require-owner.middleware');
const validate = require('../../middleware/validate.middleware');
const asyncHandler = require('../../utils/async-handler');
const userSchema = require('../../validation/schemas/user.schema');
const listQuery = require('../../validation/schemas/list-query.schema');
const bulkDeleteSchema = require('../../validation/schemas/bulk-delete.schema');
const { USERS } = require('../../config/constants/sort-fields.constants');
const { USERS: USERS_FILTERS } = require('../../config/constants/filter-fields.constants');
const { makeExportHandler } = require('../../exports/export.handler');
const resourceExports = require('../../exports/resource-exports');
const { fetchTarget, requireTargetUser } = require('./load-target-user');
const userPermissionsRouter = require('./user-permissions.routes');
const userGroupsRouter = require('./user-groups.routes');
const ownerTransferHandler = require('./owner-transfer.handler');
const controller = require('./users.controller');

const router = Router();
router.use(authenticate);

const listValidation = validate(listQuery(USERS, USERS_FILTERS), 'query');

router.get('/', listValidation, requirePermission('users', 'read'), asyncHandler(controller.list));
router.get('/export', listValidation, requirePermission('users', 'read'), asyncHandler(makeExportHandler(resourceExports.users)));
router.delete('/', validate(bulkDeleteSchema), requirePermission('users', 'delete'), asyncHandler(controller.bulkRemove));

router.post('/owner-transfer', requireOwner, validate(userSchema.transferOwnership), asyncHandler(ownerTransferHandler));

router.get('/:id', validate(userSchema.params, 'params'), requireTargetUser, asyncHandler(controller.getById));
router.post('/', validate(userSchema.create), requirePermission('users', 'create'), asyncHandler(controller.create));

router.patch(
  '/:id',
  validate(userSchema.params, 'params'),
  validate(userSchema.update),
  requirePermission('users', 'update', { loadTarget: fetchTarget }),
  requireTargetUser,
  asyncHandler(controller.update),
);

router.delete(
  '/:id',
  validate(userSchema.params, 'params'),
  requirePermission('users', 'delete', { loadTarget: fetchTarget }),
  requireTargetUser,
  asyncHandler(controller.remove),
);

router.use('/:id/permissions', userPermissionsRouter);
router.use('/:id/groups', userGroupsRouter);

module.exports = router;
