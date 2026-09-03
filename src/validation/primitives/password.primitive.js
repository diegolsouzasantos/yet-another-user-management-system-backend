const { z } = require('zod');

const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

const passwordPrimitive = z.string()
  .min(8, { message: 'validation.password_too_short' })
  .refine((value) => SPECIAL_CHAR_REGEX.test(value), { message: 'validation.password_needs_special_char' });

module.exports = passwordPrimitive;
