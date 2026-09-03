function escapeCell(value) {
  if (value === null || value === undefined) return '';
  const text = value instanceof Date ? value.toISOString() : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(columns, rows) {
  const header = columns.map((column) => escapeCell(column.header)).join(',');
  const lines = rows.map((row) => columns.map((column) => escapeCell(column.value(row))).join(','));
  return [header, ...lines].join('\r\n').concat('\r\n');
}

module.exports = { toCsv };
