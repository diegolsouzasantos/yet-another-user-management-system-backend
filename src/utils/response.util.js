function sendSuccess(res, data, status = 200) {
  return res.status(status).json({ data });
}

function sendCreated(res, data) {
  return sendSuccess(res, data, 201);
}

function sendNoContent(res) {
  return res.status(204).send();
}

module.exports = { sendSuccess, sendCreated, sendNoContent };
