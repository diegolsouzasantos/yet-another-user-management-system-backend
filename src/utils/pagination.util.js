const PAGE_SIZES = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

function parsePagination(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const requested = Number(query.limit);
  const limit = PAGE_SIZES.includes(requested) ? requested : DEFAULT_LIMIT;

  return { page, limit, offset: (page - 1) * limit };
}

function buildPaginationMeta({ page, limit }, total) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}

module.exports = { parsePagination, buildPaginationMeta, PAGE_SIZES, DEFAULT_LIMIT };
