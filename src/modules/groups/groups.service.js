const repository = require('./groups.repository');
const { recordCreate, recordChange, recordDelete } = require('../../audit/audit-log.service');
const ConflictError = require('../../errors/conflict-error');
const rethrowUniqueAs = require('../../utils/rethrow-unique');
const { parsePagination, buildPaginationMeta } = require('../../utils/pagination.util');
const { parseSort } = require('../../utils/sort.util');
const { buildWhere } = require('../../utils/filter.util');
const { GROUPS } = require('../../config/constants/sort-fields.constants');
const { GROUPS: GROUPS_FILTERS } = require('../../config/constants/filter-fields.constants');

async function list(query) {
  const pagination = parsePagination(query);
  const order = parseSort(query, GROUPS, ['createdAt', 'ASC']);
  const { where } = buildWhere(query.filters, GROUPS_FILTERS);
  const { rows, count } = await repository.findAndCountAll({ ...pagination, order, where });
  return { rows, meta: buildPaginationMeta(pagination, count) };
}

async function create(actor, data) {
  if (await repository.findByName(data.name)) {
    throw new ConflictError('errors.group_name_taken');
  }

  const group = await repository.create(data).catch(rethrowUniqueAs('errors.group_name_taken'));
  await recordCreate(actor.userId, 'Group', group.id);
  return repository.findById(group.id);
}

async function update(actor, target, data) {
  const before = target.name;
  const updated = await repository.update(target, data);

  if (data.name && data.name !== before) {
    await recordChange(actor.userId, 'Group', target.id, [{ field: 'name', oldValue: before, newValue: data.name }]);
  }

  return repository.findById(updated.id);
}

async function remove(actor, target) {
  await recordDelete(actor.userId, 'Group', target.id);
  await repository.remove(target);
}

async function bulkRemove(actor, ids) {
  const deleted = [];
  const skipped = [];

  for (const id of ids) {
    const target = await repository.findById(id);
    if (!target) {
      skipped.push({ id, reason: 'not_found' });
    } else {
      await recordDelete(actor.userId, 'Group', id);
      await repository.remove(target);
      deleted.push(id);
    }
  }

  return { deleted, skipped };
}

module.exports = { list, create, update, remove, bulkRemove };
