const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const DiskStorage = require('../providers/DiskStorage');

class PlatesImgController {
    async update(req, res) {
        const { id } = req.params;
        const imageFilename = req.file.filename;

        const diskStorage = new DiskStorage();

        const plate = await knex('plates').where('id', id).first();

        if (!plate) {
            throw new AppError('Esse prato não existe', 400)
        }

        if (plate.image) {
            await diskStorage.deleteFile(plate.image);
        }

        const filename = await diskStorage.saveFile(imageFilename);
        plate.image = filename;

        await knex('plates').update(plate).where('id', id);

        return res.json(plate);
    }
}


module.exports = PlatesImgController;