const knex = require("../database/knex")
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class PlatesController {
    async create(request, response) {
        const { title, description, ingredients, price, category } = request.body;
        const imageFile = request.file;

        const checkPlateExists = await knex('plates').where('title', title).first();

        if (checkPlateExists) {
            throw new AppError('Este prato já está cadastrado.');
        }

        const diskStorage = new DiskStorage();
        let imageFilename;

        if (imageFile) {
            imageFilename = await diskStorage.saveFile(imageFile.filename);
        }

        const [plates_id] = await knex("plates").insert({
            title,
            description,
            price,
            category,
            image: imageFilename
        });

        if (ingredients) {
            const ingredientsInsert = ingredients.map(ingredient => {
                return {
                    name: ingredient,
                    plates_id
                }
            });
            await knex("ingredients").insert(ingredientsInsert);
        }
        return response.json();
    }

    async update(req, res) {
        const { id } = req.params;
        const { title, description, category, price, ingredients } = req.body; // Adicionei 'ingredients'
        const imageFile = req.file;

        const plate = await knex('plates').where('id', id).first();

        if (!plate) {
            throw new AppError('Esse prato não existe', 400);
        }

        plate.title = title ?? plate.title;
        plate.description = description ?? plate.description;
        plate.category = category ?? plate.category;
        plate.price = price ?? plate.price;

        if (imageFile) {
            const imageFilename = imageFile.filename;
            const diskStorage = new DiskStorage();
            const newFilename = await diskStorage.saveFile(imageFilename);
            plate.image = newFilename;
        }

        await knex('plates').where('id', id).update({
            title: plate.title,
            description: plate.description,
            category: plate.category,
            price: plate.price,
            image: plate.image
        });

        // Atualizando os ingredientes
        if (ingredients) {
            // Remover os ingredientes existentes
            await knex('ingredients').where('plates_id', id).delete();

            // Adicionar os novos ingredientes
            const ingredientsInsert = ingredients.map(ingredient => ({
                name: ingredient,
                plates_id: id,
            }));
            await knex('ingredients').insert(ingredientsInsert);
        }

        return res.json(plate);
    }


    async show(request, response) {
        const { id } = request.params;

        const plate = await knex("plates").where({ id }).first();
        const ingredients = await knex("ingredients").where({ plates_id: id }).orderBy("name");

        return response.json({
            ...plate,
            ingredients,
        });
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("plates").where({ id }).delete();

        return response.json();

    }

    async index(request, response) {
        const { title, ingredients } = request.query

        let plates;

        if (ingredients) {
            const filterIngredients = ingredients.split(',').map((ingredient) => ingredient.trim());

            plates = await knex('plates')
                .select([
                    'plates.id',
                    'plates.title',
                    'plates.description',
                    'plates.category',
                    'plates.price',
                    'plates.image'
                ])
                .whereIn('plates.id', function () {
                    this.select('ingredients.plates_id')
                        .from('ingredients')
                        .whereIn('name', filterIngredients)
                        .groupBy('ingredients.plates_id')
                        .havingRaw('COUNT(DISTINCT ingredients.name) = ?', filterIngredients.length);
                })
                .where('plates.title', 'like', `%${title}%`)
                .orderBy('plates.title');
        } else {
            plates = await knex('plates')
                .where('plates.title', 'like', `%${title}%`)
                .orderBy('plates.title');
        }

        const platesIds = plates.map((plate) => plate.id);
        const platesIngredients = await knex('ingredients').whereIn('plates_id', platesIds);

        const platesWithIngredients = plates.map((plate) => {
            const plateIngredients = platesIngredients.filter(
                (ingredient) => ingredient.plates_id === plate.id
            );

            return {
                ...plate,
                ingredients: plateIngredients
            };
        });

        return response.status(200).json(platesWithIngredients);
    }
};
module.exports = PlatesController;