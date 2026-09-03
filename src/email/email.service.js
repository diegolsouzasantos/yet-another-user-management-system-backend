const { t } = require('../i18n/i18n.service');

function dispatch({ to, subject, body }) {
  console.log(`[email] to=${to} | subject=${subject}\n${body}\n`);
  return Promise.resolve({ to, subject, body });
}

function sendPasswordResetEmail({ to, resetUrl, locale }) {
  return dispatch({
    to,
    subject: t(locale, 'email.reset_subject'),
    body: t(locale, 'email.reset_body', { url: resetUrl }),
  });
}

function sendExportEmail({ to, resource, rowCount, byteSize, filename, csv }) {
  const preview = csv.split('\n').slice(0, 6).join('\n');
  const body = [
    `Your ${resource} export is attached as ${filename}.`,
    `${rowCount} rows, ${byteSize} bytes.`,
    '',
    'Preview:',
    preview,
  ].join('\n');
  return dispatch({ to, subject: `yaUMS export: ${resource}`, body });
}

module.exports = { sendPasswordResetEmail, sendExportEmail };
