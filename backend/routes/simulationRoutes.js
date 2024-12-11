const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');
const { validateApiKey } = require('../middlewares/authMiddleware');

router.use(validateApiKey);


router.get('/', validateApiKey,simulationController.listTests); 
router.post('/', validateApiKey, simulationController.createTest); 
router.post('/:testId/questoes', validateApiKey, simulationController.addQuestionsToTest); 
router.get('/:testId/detalhes', validateApiKey, simulationController.getTestDetails); 

router.put('/:testId', validateApiKey, simulationController.updateTest);
router.delete('/:testId', validateApiKey, simulationController.deleteTest);

router.post('/:testId/finalizar', validateApiKey, simulationController.finalizeTest);


module.exports = router;
