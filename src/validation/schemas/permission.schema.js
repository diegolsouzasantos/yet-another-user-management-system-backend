const { z } = require('zod');
const idPrimitive = require('../primitives/id.primitive');

const params = z.object({ id: idPrimitive });

module.exports = { params };
