const multer = require("multer");
const uploadConfig = require("../configs/upload");
const { Router } = require('express');

const platesRoutes = Router();
const PlatesController = require('../controller/PlatesController');
const platesController = new PlatesController();
const PlatesImgController = require('../controller/PlatesImgController');
const platesImgController = new PlatesImgController();
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const ensureUserIsAdmin = require('../middlewares/ensureUserIsAdmin');
const upload = multer(uploadConfig.MULTER);

platesRoutes.use(ensureAuthenticated);

platesRoutes.post('/', ensureUserIsAdmin('admin'), upload.single('image'), platesController.create);
platesRoutes.put('/:id', ensureUserIsAdmin('admin'), upload.single('image'), platesController.update);
platesRoutes.delete('/:id', ensureUserIsAdmin('admin'), platesController.delete);

platesRoutes.get('/:id', platesController.show);
platesRoutes.get('/', platesController.index);
platesRoutes.patch('/image/:id', upload.single('image'), platesImgController.update);

module.exports = platesRoutes;
