const repository = require('./users.repository');
const NotFoundError = require('../../errors/not-found-error');
const asyncHandler = require('../../utils/async-handler');

function fetchTarget(req) {
  return repository.findById(req.params.id);
}

const requireTargetUser = asyncHandler(async (req, res, next) => {
  const target = req.target || await fetchTarget(req);
  if (!target) {
    throw new NotFoundError();
  }

  req.target = target;
  next();
});

module.exports = { fetchTarget, requireTargetUser };
