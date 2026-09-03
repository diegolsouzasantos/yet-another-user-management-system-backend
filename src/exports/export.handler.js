const env = require('../config/env');
const { toCsv } = require('../utils/csv.util');
const { sendExportEmail } = require('../email/email.service');
const { parseSort } = require('../utils/sort.util');
const { buildWhere } = require('../utils/filter.util');

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').replace('Z', '');
}

function makeExportHandler(config) {
  return async (req, res) => {
    const order = parseSort(req.query, config.sortFields, config.sortDefault);
    const { where, joins } = buildWhere(req.query.filters, config.filterCatalogue);
    const ids = req.query.ids
      ? String(req.query.ids).split(',').map((value) => value.trim()).filter(Boolean)
      : null;

    const rows = await config.loadRows({ where, joins, order, ids });
    const csv = toCsv(config.columns, rows);
    const buffer = Buffer.from(csv, 'utf8');
    const filename = `${config.resourceName}-${stamp()}.csv`;

    if (buffer.byteLength > env.CSV_EMAIL_THRESHOLD_BYTES) {
      await sendExportEmail({
        to: req.actorUser.email,
        resource: config.resourceName,
        rowCount: rows.length,
        byteSize: buffer.byteLength,
        filename,
        csv,
      });
      return res.status(202).json({
        data: {
          emailed: true,
          email: req.actorUser.email,
          rows: rows.length,
          bytes: buffer.byteLength,
          filename,
        },
      });
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  };
}

module.exports = { makeExportHandler };
