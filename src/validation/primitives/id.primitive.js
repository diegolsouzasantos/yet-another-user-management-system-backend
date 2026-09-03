const { z } = require('zod');

const idPrimitive = z.string().uuid({ message: 'validation.invalid_uuid' });

module.exports = idPrimitive;
