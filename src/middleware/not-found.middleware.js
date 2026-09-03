const NotFoundError = require('../errors/not-found-error');

function notFound(req, res, next) {
  next(new NotFoundError());
}

module.exports = notFound;
