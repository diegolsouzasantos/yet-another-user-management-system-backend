const repository = require('./audit-logs.repository');
const { parsePagination, buildPaginationMeta } = require('../../utils/pagination.util');
const { parseSort } = require('../../utils/sort.util');
const { buildWhere } = require('../../utils/filter.util');
const { AUDIT_LOGS } = require('../../config/constants/sort-fields.constants');
const { AUDIT_LOGS: AUDIT_LOGS_FILTERS } = require('../../config/constants/filter-fields.constants');

async function list(query) {
  const pagination = parsePagination(query);
  const order = parseSort(query, AUDIT_LOGS, ['createdAt', 'DESC']);
  const { where } = buildWhere(query.filters, AUDIT_LOGS_FILTERS);
  const { rows, count } = await repository.findAndCountAll({ ...pagination, order, where });
  return { rows, meta: buildPaginationMeta(pagination, count) };
}

module.exports = { list };
