const { z } = require('zod');
const emailPrimitive = require('../primitives/email.primitive');
const passwordPrimitive = require('../primitives/password.primitive');

const login = z.object({
  email: emailPrimitive,
  password: z.string().min(1, { message: 'validation.field_required' }),
});

const refresh = z.object({
  refreshToken: z.string().min(1, { message: 'validation.field_required' }),
});

const forgotPassword = z.object({ email: emailPrimitive });

const resetPassword = z.object({
  token: z.string().min(1, { message: 'validation.field_required' }),
  password: passwordPrimitive,
});

module.exports = { login, refresh, forgotPassword, resetPassword };
