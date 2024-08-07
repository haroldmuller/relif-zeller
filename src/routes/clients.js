const Router = require('koa-router');
const clientsController = require('../controllers/clients');

const router = new Router();

router.get('/clients', clientsController.getClients);
router.post('/clients', clientsController.createClient);
router.get('/clients/:id', clientsController.getClient);
router.get('/clients-to-do-follow-up', clientsController.getClientsToFollowUp);

module.exports = router;
