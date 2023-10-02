const knex = require("../database/knex"); 

class TagsController{
    async index(request, response){
        const {user_id}  = request.params; 

        const movie_tags = await knex("movie_tags")
        .where({ user_id })

        return response.json(movie_tags);
    }
}

module.exports = TagsController; 