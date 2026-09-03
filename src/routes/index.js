const { Router } = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const homeRoutes = require('../modules/home/home.routes');
const usersRoutes = require('../modules/users/users.routes');
const groupsRoutes = require('../modules/groups/groups.routes');
const rolesRoutes = require('../modules/roles/roles.routes');
const permissionsRoutes = require('../modules/permissions/permissions.routes');
const auditLogsRoutes = require('../modules/audit-logs/audit-logs.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/home', homeRoutes);
router.use('/users', usersRoutes);
router.use('/groups', groupsRoutes);
router.use('/roles', rolesRoutes);
router.use('/permissions', permissionsRoutes);
router.use('/audit-logs', auditLogsRoutes);

module.exports = router;
