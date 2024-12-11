const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateApiKey } = require('../middlewares/authMiddleware');

router.get('/', validateApiKey, userController.listUsers);
router.get('/historico', validateApiKey, userController.getHistorico);

module.exports = router;
