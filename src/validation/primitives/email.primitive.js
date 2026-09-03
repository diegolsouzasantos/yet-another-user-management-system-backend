const { z } = require('zod');

const emailPrimitive = z.string().email({ message: 'validation.email_invalid' });

module.exports = emailPrimitive;
