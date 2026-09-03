const { Op } = require('sequelize');
const db = require('../db/models');

const FILTER_OPERATORS = {
  text: ['eq', 'neq', 'contains', 'startsWith', 'endsWith'],
  enum: ['eq', 'neq', 'in'],
  relation: ['eq', 'neq', 'in'],
  relationJoin: ['eq', 'neq', 'in'],
  boolean: ['isTrue', 'isFalse'],
  number: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between'],
  date: ['eq', 'gt', 'gte', 'lt', 'lte', 'between'],
};

const VALUELESS_OPERATORS = ['isTrue', 'isFalse'];
const MULTI_VALUE_OPERATORS = ['in'];
const RANGE_OPERATORS = ['between'];

function escapeLike(value) {
  return String(value).replace(/[\\%_]/g, '\\$&');
}

function rangeBounds(value) {
  if (Array.isArray(value)) return [value[0], value[1]];
  return [value.from, value.to];
}

function buildCondition(operator, value) {
  switch (operator) {
    case 'eq': return { [Op.eq]: value };
    case 'neq': return { [Op.ne]: value };
    case 'contains': return { [Op.iLike]: `%${escapeLike(value)}%` };
    case 'startsWith': return { [Op.iLike]: `${escapeLike(value)}%` };
    case 'endsWith': return { [Op.iLike]: `%${escapeLike(value)}` };
    case 'in': return { [Op.in]: value };
    case 'isTrue': return { [Op.eq]: true };
    case 'isFalse': return { [Op.eq]: false };
    case 'gt': return { [Op.gt]: value };
    case 'gte': return { [Op.gte]: value };
    case 'lt': return { [Op.lt]: value };
    case 'lte': return { [Op.lte]: value };
    case 'between': return { [Op.between]: rangeBounds(value) };
    default: return { [Op.eq]: value };
  }
}

function groupByColumn(filters, catalogue) {
  const columns = new Map();
  const joins = [];

  filters.forEach((filter) => {
    const meta = catalogue[filter.field];
    if (!meta) return;
    if (meta.type === 'relationJoin') {
      joins.push({ ...filter, meta });
      return;
    }
    if (!columns.has(meta.column)) columns.set(meta.column, []);
    columns.get(meta.column).push(buildCondition(filter.operator, filter.value));
  });

  return { columns, joins };
}

function buildWhere(filters, catalogue) {
  if (!Array.isArray(filters) || filters.length === 0) {
    return { where: {}, joins: [] };
  }

  const { columns, joins } = groupByColumn(filters, catalogue);
  const clauses = [];

  columns.forEach((conditions, column) => {
    if (conditions.length === 1) {
      clauses.push({ [column]: conditions[0] });
    } else {
      clauses.push({ [Op.or]: conditions.map((condition) => ({ [column]: condition })) });
    }
  });

  return { where: clauses.length ? { [Op.and]: clauses } : {}, joins };
}

function mergeWhere(...parts) {
  const present = parts.filter(
    (part) => part && (Object.keys(part).length > 0 || Object.getOwnPropertySymbols(part).length > 0),
  );
  if (present.length === 0) return {};
  if (present.length === 1) return present[0];
  return { [Op.and]: present };
}

async function resolveJoinWhere(joins) {
  if (!joins.length) return {};

  const included = new Set();
  const excluded = new Set();

  joins.forEach(({ operator, value }) => {
    const values = Array.isArray(value) ? value : [value];
    const bucket = operator === 'neq' ? excluded : included;
    values.forEach((item) => bucket.add(item));
  });

  const clauses = [];

  if (included.size) {
    const { joinModel, joinLocalKey, joinForeignKey } = joins[0].meta;
    const rows = await db[joinModel].findAll({
      where: { [joinForeignKey]: [...included] },
      attributes: [joinLocalKey],
    });
    clauses.push({ id: { [Op.in]: rows.map((row) => row[joinLocalKey]) } });
  }

  if (excluded.size) {
    const { joinModel, joinLocalKey, joinForeignKey } = joins[0].meta;
    const rows = await db[joinModel].findAll({
      where: { [joinForeignKey]: [...excluded] },
      attributes: [joinLocalKey],
    });
    const ids = rows.map((row) => row[joinLocalKey]);
    if (ids.length) clauses.push({ id: { [Op.notIn]: ids } });
  }

  return clauses.length ? { [Op.and]: clauses } : {};
}

module.exports = {
  FILTER_OPERATORS,
  VALUELESS_OPERATORS,
  MULTI_VALUE_OPERATORS,
  RANGE_OPERATORS,
  buildWhere,
  mergeWhere,
  resolveJoinWhere,
};
