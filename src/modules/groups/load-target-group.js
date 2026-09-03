const repository = require('./groups.repository');
const NotFoundError = require('../../errors/not-found-error');
const asyncHandler = require('../../utils/async-handler');

function fetchTarget(req) {
  return repository.findById(req.params.id);
}

const requireTargetGroup = asyncHandler(async (req, res, next) => {
  const target = req.target || await fetchTarget(req);
  if (!target) {
    throw new NotFoundError();
  }

  req.target = target;
  next();
});

module.exports = { fetchTarget, requireTargetGroup };
