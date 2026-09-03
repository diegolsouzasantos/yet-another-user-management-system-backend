const { z } = require('zod');
const idPrimitive = require('../primitives/id.primitive');

module.exports = z.object({
  ids: z.array(idPrimitive).min(1).max(200),
});
