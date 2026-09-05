function escapeCell(value) {
  if (value === null || value === undefined) return '';
  const text = value instanceof Date ? value.toISOString() : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function csvHeaderLine(columns) {
  return `${columns.map((column) => escapeCell(column.header)).join(',')}\r\n`;
}

function csvRowLines(columns, rows) {
  if (!rows.length) return '';
  return `${rows.map((row) => columns.map((column) => escapeCell(column.value(row))).join(',')).join('\r\n')}\r\n`;
}

module.exports = { escapeCell, csvHeaderLine, csvRowLines };
