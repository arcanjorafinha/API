const { Router } = require('express');

const routes = Router();

const usersRouter = require('./users.routes');
const sessionsRouter = require('./sessions.routes');
const platesRouter = require('./plates.routes');
const ordersRouter = require('./orders.routes');

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/plates', platesRouter);
routes.use('/orders', ordersRouter);


module.exports = routes;