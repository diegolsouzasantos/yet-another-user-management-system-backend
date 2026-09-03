const repository = require('./roles.repository');
const { assertNotSystemRole } = require('./roles.policy');
const { recordCreate, recordChange, recordDelete } = require('../../audit/audit-log.service');
const ConflictError = require('../../errors/conflict-error');
const rethrowUniqueAs = require('../../utils/rethrow-unique');
const { parsePagination, buildPaginationMeta } = require('../../utils/pagination.util');
const { parseSort } = require('../../utils/sort.util');
const { buildWhere } = require('../../utils/filter.util');
const { ROLES } = require('../../config/constants/sort-fields.constants');
const { ROLES: ROLES_FILTERS } = require('../../config/constants/filter-fields.constants');

async function list(query) {
  const pagination = parsePagination(query);
  const order = parseSort(query, ROLES, ['createdAt', 'ASC']);
  const { where } = buildWhere(query.filters, ROLES_FILTERS);
  const { rows, count } = await repository.findAndCountAll({ ...pagination, order, where });
  return { rows, meta: buildPaginationMeta(pagination, count) };
}

async function create(actor, data) {
  if (await repository.findByName(data.name)) {
    throw new ConflictError('errors.role_name_taken');
  }

  const role = await repository.create(data).catch(rethrowUniqueAs('errors.role_name_taken'));
  await recordCreate(actor.userId, 'Role', role.id);
  return repository.findById(role.id);
}

async function update(actor, target, data) {
  assertNotSystemRole(target);
  const before = target.name;
  const updated = await repository.update(target, data);

  if (data.name && data.name !== before) {
    await recordChange(actor.userId, 'Role', target.id, [{ field: 'name', oldValue: before, newValue: data.name }]);
  }

  return repository.findById(updated.id);
}

async function remove(actor, target) {
  assertNotSystemRole(target);
  if (await repository.countUsers(target.id) > 0) {
    throw new ConflictError('errors.role_in_use');
  }
  await recordDelete(actor.userId, 'Role', target.id);
  await repository.remove(target);
}

async function bulkRemove(actor, ids) {
  const deleted = [];
  const skipped = [];

  for (const id of ids) {
    const target = await repository.findById(id);
    if (!target) {
      skipped.push({ id, reason: 'not_found' });
    } else if (target.isSystemRole) {
      skipped.push({ id, reason: 'system_role' });
    } else if (await repository.countUsers(id) > 0) {
      skipped.push({ id, reason: 'in_use' });
    } else {
      await recordDelete(actor.userId, 'Role', id);
      await repository.remove(target);
      deleted.push(id);
    }
  }

  return { deleted, skipped };
}

module.exports = { list, create, update, remove, bulkRemove };
