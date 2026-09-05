const db = require('../db/models');
const { mergeWhere, resolveJoinWhere } = require('../utils/filter.util');
const SORT = require('../config/constants/sort-fields.constants');
const FILTERS = require('../config/constants/filter-fields.constants');

const iso = (value) => (value ? new Date(value).toISOString() : '');
const idClause = (ids) => (ids && ids.length ? { id: ids } : {});

const users = {
  resourceName: 'users',
  sortFields: SORT.USERS,
  sortDefault: ['createdAt', 'ASC'],
  filterCatalogue: FILTERS.USERS,
  columns: [
    { header: 'id', value: (row) => row.id },
    { header: 'email', value: (row) => row.email },
    { header: 'firstName', value: (row) => row.firstName },
    { header: 'lastName', value: (row) => row.lastName },
    { header: 'role', value: (row) => (row.Role ? row.Role.name : '') },
    { header: 'isOwner', value: (row) => row.isOwner },
    { header: 'isActive', value: (row) => row.isActive },
    { header: 'createdAt', value: (row) => iso(row.createdAt) },
    { header: 'updatedAt', value: (row) => iso(row.updatedAt) },
  ],
  loadRows: async ({
    where, joins, order, ids, limit, offset,
  }) => {
    const joinWhere = await resolveJoinWhere(joins || []);
    return db.User.findAll({
      where: mergeWhere(where, joinWhere, idClause(ids)),
      order,
      limit,
      offset,
      include: [db.Role],
    });
  },
};

const groups = {
  resourceName: 'groups',
  sortFields: SORT.GROUPS,
  sortDefault: ['createdAt', 'ASC'],
  filterCatalogue: FILTERS.GROUPS,
  columns: [
    { header: 'id', value: (row) => row.id },
    { header: 'name', value: (row) => row.name },
    { header: 'description', value: (row) => row.description },
    { header: 'createdAt', value: (row) => iso(row.createdAt) },
    { header: 'updatedAt', value: (row) => iso(row.updatedAt) },
  ],
  loadRows: async ({
    where, ids, order, limit, offset,
  }) => db.Group.findAll({
    where: mergeWhere(where, idClause(ids)), order, limit, offset,
  }),
};

const roles = {
  resourceName: 'roles',
  sortFields: SORT.ROLES,
  sortDefault: ['createdAt', 'ASC'],
  filterCatalogue: FILTERS.ROLES,
  columns: [
    { header: 'id', value: (row) => row.id },
    { header: 'name', value: (row) => row.name },
    { header: 'description', value: (row) => row.description },
    { header: 'isSystemRole', value: (row) => row.isSystemRole },
    { header: 'grantsAllPermissions', value: (row) => row.grantsAllPermissions },
    { header: 'createdAt', value: (row) => iso(row.createdAt) },
    { header: 'updatedAt', value: (row) => iso(row.updatedAt) },
  ],
  loadRows: async ({
    where, ids, order, limit, offset,
  }) => db.Role.findAll({
    where: mergeWhere(where, idClause(ids)), order, limit, offset,
  }),
};

const auditLogs = {
  resourceName: 'audit-logs',
  sortFields: SORT.AUDIT_LOGS,
  sortDefault: ['createdAt', 'DESC'],
  filterCatalogue: FILTERS.AUDIT_LOGS,
  columns: [
    { header: 'id', value: (row) => row.id },
    { header: 'actor', value: (row) => (row.actor ? row.actor.email : '') },
    { header: 'entityType', value: (row) => row.entityType },
    { header: 'entityId', value: (row) => row.entityId },
    { header: 'action', value: (row) => row.action },
    { header: 'fieldName', value: (row) => row.fieldName },
    { header: 'oldValue', value: (row) => row.oldValue },
    { header: 'newValue', value: (row) => row.newValue },
    { header: 'createdAt', value: (row) => iso(row.createdAt) },
  ],
  loadRows: async ({
    where, ids, order, limit, offset,
  }) => db.AuditLog.findAll({
    where: mergeWhere(where, idClause(ids)),
    order,
    limit,
    offset,
    include: [{ model: db.User, as: 'actor', attributes: ['id', 'email', 'firstName', 'lastName'] }],
  }),
};

module.exports = {
  users, groups, roles, 'audit-logs': auditLogs,
};
