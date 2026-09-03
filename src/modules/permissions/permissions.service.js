const repository = require('./permissions.repository');
const { parsePagination, buildPaginationMeta } = require('../../utils/pagination.util');
const { parseSort } = require('../../utils/sort.util');
const { buildWhere } = require('../../utils/filter.util');
const { PERMISSIONS } = require('../../config/constants/sort-fields.constants');
const { PERMISSIONS: PERMISSIONS_FILTERS } = require('../../config/constants/filter-fields.constants');

async function list(query) {
  const pagination = parsePagination(query);
  const order = parseSort(query, PERMISSIONS, ['resource', 'ASC']);
  const { where } = buildWhere(query.filters, PERMISSIONS_FILTERS);
  const { rows, count } = await repository.findAndCountAll({ ...pagination, order, where });
  return { rows, meta: buildPaginationMeta(pagination, count) };
}

module.exports = { list };
