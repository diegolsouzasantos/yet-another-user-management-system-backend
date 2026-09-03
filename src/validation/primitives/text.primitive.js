const { z } = require('zod');

function requiredText(maxLength = 255) {
  return z.string().min(1, { message: 'validation.field_required' }).max(maxLength);
}

module.exports = requiredText;
