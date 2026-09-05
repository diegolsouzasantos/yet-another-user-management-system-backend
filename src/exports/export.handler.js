const fs = require('fs');
const os = require('os');
const path = require('path');
const { randomUUID } = require('crypto');
const env = require('../config/env');
const { csvHeaderLine, csvRowLines } = require('../utils/csv.util');
const { sendExportEmail } = require('../email/email.service');
const { parseSort } = require('../utils/sort.util');
const { buildWhere } = require('../utils/filter.util');

const PAGE_SIZE = 500;

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').replace('Z', '');
}

function writeAsync(stream, chunk) {
  return new Promise((resolve, reject) => {
    const ok = stream.write(chunk, (error) => (error ? reject(error) : undefined));
    if (ok) resolve();
    else stream.once('drain', resolve);
  });
}

async function writeExportToTempFile(config, order, where, joins, ids) {
  const tmpPath = path.join(os.tmpdir(), `yaums-export-${randomUUID()}.csv`);
  const stream = fs.createWriteStream(tmpPath);

  await writeAsync(stream, csvHeaderLine(config.columns));

  let rowCount = 0;
  for (let offset = 0; ; offset += PAGE_SIZE) {
    // eslint-disable-next-line no-await-in-loop
    const page = await config.loadRows({
      where, joins, order, ids, limit: PAGE_SIZE, offset,
    });
    if (!page.length) break;
    // eslint-disable-next-line no-await-in-loop
    await writeAsync(stream, csvRowLines(config.columns, page));
    rowCount += page.length;
    if (page.length < PAGE_SIZE) break;
  }

  await new Promise((resolve, reject) => {
    stream.end((error) => (error ? reject(error) : resolve()));
  });

  return { tmpPath, rowCount };
}

function makeExportHandler(config) {
  return async (req, res) => {
    const order = parseSort(req.query, config.sortFields, config.sortDefault);
    const { where, joins } = buildWhere(req.query.filters, config.filterCatalogue);
    const ids = req.query.ids
      ? String(req.query.ids).split(',').map((value) => value.trim()).filter(Boolean)
      : null;

    const { tmpPath, rowCount } = await writeExportToTempFile(config, order, where, joins, ids);
    const cleanup = () => fs.promises.unlink(tmpPath).catch(() => {});

    try {
      const { size: byteLength } = await fs.promises.stat(tmpPath);
      const filename = `${config.resourceName}-${stamp()}.csv`;

      if (byteLength > env.CSV_EMAIL_THRESHOLD_BYTES) {
        const head = await fs.promises.readFile(tmpPath, 'utf8');
        const preview = head.split('\n').slice(0, 6).join('\n');
        await sendExportEmail({
          to: req.actorUser.email,
          resource: config.resourceName,
          rowCount,
          byteSize: byteLength,
          filename,
          csv: preview,
        });
        await cleanup();
        return res.status(202).json({
          data: {
            emailed: true, email: req.actorUser.email, rows: rowCount, bytes: byteLength, filename,
          },
        });
      }

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      const readStream = fs.createReadStream(tmpPath);
      readStream.on('close', cleanup);
      readStream.on('error', cleanup);
      readStream.pipe(res);
      return undefined;
    } catch (error) {
      await cleanup();
      throw error;
    }
  };
}

module.exports = { makeExportHandler };
