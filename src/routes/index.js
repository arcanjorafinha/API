const { Router } = require('express');

const routes = Router();

const usersRouter = require('./users.routes');
const sessionsRouter = require('./sessions.routes');
const platesRouter = require('./plates.routes');

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/plates', platesRouter);


module.exports = routes;