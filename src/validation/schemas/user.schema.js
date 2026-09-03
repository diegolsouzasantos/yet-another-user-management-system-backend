const { z } = require('zod');
const emailPrimitive = require('../primitives/email.primitive');
const passwordPrimitive = require('../primitives/password.primitive');
const idPrimitive = require('../primitives/id.primitive');
const requiredText = require('../primitives/text.primitive');

const create = z.object({
  email: emailPrimitive,
  password: passwordPrimitive,
  firstName: requiredText(100),
  lastName: requiredText(100),
  roleId: idPrimitive,
});

const update = create.partial();

const params = z.object({ id: idPrimitive });

const transferOwnership = z.object({
  targetUserId: idPrimitive,
  currentPassword: z.string().min(1, { message: 'validation.field_required' }),
});

module.exports = { create, update, params, transferOwnership };
