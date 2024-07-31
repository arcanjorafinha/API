const { Router } = require('express');
const UserController = require('../controller/UsersController');
const userController = new UserController();

const userRoutes = Router();

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

userRoutes.post('/', userController.create);
userRoutes.put('/', ensureAuthenticated, userController.update);


module.exports = userRoutes;