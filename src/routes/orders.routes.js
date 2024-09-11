const { Router } = require('express');
const ordersRoutes = Router();
const OrdersController = require('../controller/OrdersController');
const ordersController = new OrdersController();
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const ensureUserIsAdmin = require('../middlewares/ensureUserIsAdmin');

ordersRoutes.use(ensureAuthenticated);

ordersRoutes.post('/', ordersController.create);
ordersRoutes.put('/', ensureUserIsAdmin('admin'), ordersController.update);
ordersRoutes.get('/', ordersController.index);
ordersRoutes.delete('/items/:id', ordersController.removeItem);





module.exports = ordersRoutes;