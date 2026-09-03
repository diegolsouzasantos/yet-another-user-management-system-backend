const repository = require('./users.repository');
const hasPermission = require('../../rbac/permission-check.service');
const { assertRoleAssignable } = require('./users.policy');
const buildUserDiffs = require('./build-user-diffs');
const applyPasswordUpdate = require('./apply-password-update');
const { hashPassword } = require('../auth/password.service');
const { recordCreate, recordChange, recordDelete } = require('../../audit/audit-log.service');
const ConflictError = require('../../errors/conflict-error');
const NotFoundError = require('../../errors/not-found-error');
const rethrowUniqueAs = require('../../utils/rethrow-unique');
const { parsePagination, buildPaginationMeta } = require('../../utils/pagination.util');
const { parseSort } = require('../../utils/sort.util');
const { buildWhere } = require('../../utils/filter.util');
const { USERS } = require('../../config/constants/sort-fields.constants');
const { USERS: USERS_FILTERS } = require('../../config/constants/filter-fields.constants');

async function list(query) {
  const pagination = parsePagination(query);
  const order = parseSort(query, USERS, ['createdAt', 'ASC']);
  const { where, joins } = buildWhere(query.filters, USERS_FILTERS);
  const { rows, count } = await repository.findAndCountAll({ ...pagination, order, where, joins });
  return { rows, meta: buildPaginationMeta(pagination, count) };
}

async function create(actor, data) {
  const role = await repository.findRoleById(data.roleId);
  if (!role) {
    throw new NotFoundError('errors.role_not_found');
  }
  assertRoleAssignable(actor, role);

  if (await repository.findByEmail(data.email)) {
    throw new ConflictError('errors.user_email_taken');
  }

  const passwordHash = await hashPassword(data.password);
  const user = await repository
    .create({ ...data, passwordHash, password: undefined })
    .catch(rethrowUniqueAs('errors.user_email_taken'));
  await recordCreate(actor.userId, 'User', user.id);
  return repository.findById(user.id);
}

async function update(actor, target, data) {
  if (data.roleId) {
    assertRoleAssignable(actor, await repository.findRoleById(data.roleId));
  }

  const before = target.toJSON();
  const payload = await applyPasswordUpdate(data);
  const updated = await repository.update(target, payload);
  await recordChange(actor.userId, 'User', target.id, buildUserDiffs(before, updated.toJSON()));
  return repository.findById(updated.id);
}

async function remove(actor, target) {
  await recordDelete(actor.userId, 'User', target.id);
  await repository.remove(target);
}

async function bulkRemove(actor, ids) {
  const deleted = [];
  const skipped = [];

  for (const id of ids) {
    const target = await repository.findById(id);
    if (!target) {
      skipped.push({ id, reason: 'not_found' });
    } else if (target.isOwner) {
      skipped.push({ id, reason: 'owner' });
    } else if (!hasPermission(actor, 'users', 'delete', target)) {
      skipped.push({ id, reason: 'forbidden' });
    } else {
      await recordDelete(actor.userId, 'User', id);
      await repository.remove(target);
      deleted.push(id);
    }
  }

  return { deleted, skipped };
}

module.exports = { list, create, update, remove, bulkRemove };
