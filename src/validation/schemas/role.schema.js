const { z } = require('zod');
const idPrimitive = require('../primitives/id.primitive');
const requiredText = require('../primitives/text.primitive');

const create = z.object({
  name: requiredText(100),
  description: z.string().max(500).optional(),
  permissionIds: z.array(idPrimitive).optional(),
});

const update = create.partial();

const params = z.object({ id: idPrimitive });

module.exports = { create, update, params };
