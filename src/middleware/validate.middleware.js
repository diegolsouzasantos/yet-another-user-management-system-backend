const ValidationError = require('../errors/validation-error');

function buildFieldErrors(issues) {
  return Object.fromEntries(
    issues.map((issue) => [issue.path.join('.') || 'root', issue.message]),
  );
}

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(new ValidationError(buildFieldErrors(result.error.issues)));
    }

    req[source] = result.data;
    return next();
  };
}

module.exports = validate;
