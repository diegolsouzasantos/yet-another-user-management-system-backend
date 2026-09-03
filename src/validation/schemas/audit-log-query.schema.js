const listQuery = require('./list-query.schema');
const { AUDIT_LOGS } = require('../../config/constants/sort-fields.constants');
const { AUDIT_LOGS: AUDIT_LOGS_FILTERS } = require('../../config/constants/filter-fields.constants');

module.exports = { query: listQuery(AUDIT_LOGS, AUDIT_LOGS_FILTERS) };
