const { Router } = require('express');
const authenticate = require('../../middleware/authenticate.middleware');
const requirePermission = require('../../middleware/authorize/require-permission.middleware');
const validate = require('../../middleware/validate.middleware');
const asyncHandler = require('../../utils/async-handler');
const auditLogQuerySchema = require('../../validation/schemas/audit-log-query.schema');
const { makeExportHandler } = require('../../exports/export.handler');
const resourceExports = require('../../exports/resource-exports');
const controller = require('./audit-logs.controller');

const router = Router();
router.use(authenticate);

const listValidation = validate(auditLogQuerySchema.query, 'query');

router.get('/', listValidation, requirePermission('audit-logs', 'read'), asyncHandler(controller.list));
router.get('/export', listValidation, requirePermission('audit-logs', 'read'), asyncHandler(makeExportHandler(resourceExports['audit-logs'])));

module.exports = router;
