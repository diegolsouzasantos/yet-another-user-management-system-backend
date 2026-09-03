const { Router } = require('express');
const authenticate = require('../../middleware/authenticate.middleware');
const asyncHandler = require('../../utils/async-handler');
const controller = require('./home.controller');

const router = Router();

router.get('/', authenticate, asyncHandler(controller.get));

module.exports = router;
