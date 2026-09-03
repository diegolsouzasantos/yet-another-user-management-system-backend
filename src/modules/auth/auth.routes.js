const { Router } = require('express');
const validate = require('../../middleware/validate.middleware');
const authenticate = require('../../middleware/authenticate.middleware');
const asyncHandler = require('../../utils/async-handler');
const authSchema = require('../../validation/schemas/auth.schema');
const controller = require('./auth.controller');

const router = Router();

router.post('/login', validate(authSchema.login), asyncHandler(controller.login));
router.post('/refresh', validate(authSchema.refresh), asyncHandler(controller.refresh));
router.post('/logout', validate(authSchema.refresh), asyncHandler(controller.logout));
router.post('/forgot-password', validate(authSchema.forgotPassword), asyncHandler(controller.forgotPassword));
router.post('/reset-password', validate(authSchema.resetPassword), asyncHandler(controller.resetPassword));
router.get('/me', authenticate, asyncHandler(controller.me));

module.exports = router;
