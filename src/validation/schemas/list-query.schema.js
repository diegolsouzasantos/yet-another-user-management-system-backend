const { z } = require('zod');
const {
  FILTER_OPERATORS, VALUELESS_OPERATORS, MULTI_VALUE_OPERATORS, RANGE_OPERATORS,
} = require('../../utils/filter.util');

function hasValue(value) {
  return value !== undefined && value !== null && value !== '';
}

function validateFilterItem(item, catalogue, ctx) {
  const meta = catalogue[item.field];
  if (!meta) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['field'], message: 'validation.filter_field_invalid' });
    return;
  }

  const allowed = FILTER_OPERATORS[meta.type] || [];
  if (!allowed.includes(item.operator)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['operator'], message: 'validation.filter_operator_invalid' });
    return;
  }

  if (VALUELESS_OPERATORS.includes(item.operator)) return;

  if (MULTI_VALUE_OPERATORS.includes(item.operator)) {
    if (!Array.isArray(item.value) || item.value.length === 0 || !item.value.every(hasValue)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['value'], message: 'validation.filter_value_invalid' });
    }
    return;
  }

  if (RANGE_OPERATORS.includes(item.operator)) {
    const value = item.value;
    const bounds = Array.isArray(value) ? value : [value && value.from, value && value.to];
    if (bounds.length !== 2 || !bounds.every(hasValue)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['value'], message: 'validation.filter_value_invalid' });
    }
    return;
  }

  if (!hasValue(item.value)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['value'], message: 'validation.filter_value_invalid' });
  }
}

function filtersSchema(catalogue) {
  const item = z
    .object({
      field: z.string(),
      operator: z.string(),
      value: z.any().optional(),
    })
    .superRefine((data, ctx) => validateFilterItem(data, catalogue, ctx));

  return z.preprocess((raw) => {
    if (raw === undefined || raw === '') return undefined;
    if (typeof raw !== 'string') return raw;
    try {
      return JSON.parse(raw);
    } catch (error) {
      return raw;
    }
  }, z.array(item).max(20).optional());
}

function listQuery(sortFields = [], filterCatalogue = null) {
  const shape = {
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    sort: sortFields.length ? z.enum(sortFields).optional() : z.undefined(),
    order: z.enum(['asc', 'desc', 'ASC', 'DESC']).optional(),
    ids: z.string().max(20000).optional(),
  };

  if (filterCatalogue) {
    shape.filters = filtersSchema(filterCatalogue);
  }

  return z.object(shape);
}

module.exports = listQuery;
