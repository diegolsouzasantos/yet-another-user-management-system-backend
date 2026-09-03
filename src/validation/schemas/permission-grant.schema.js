const { z } = require('zod');
const idPrimitive = require('../primitives/id.primitive');

const grant = z.object({ permissionIds: z.array(idPrimitive).min(1).max(100) });

const params = z.object({ id: idPrimitive, permissionId: idPrimitive });

module.exports = { grant, params };
