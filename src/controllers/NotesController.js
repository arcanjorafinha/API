const knex = require("../database/knex");

class NotesController{
    async create(request, response){
        const { title, description, tags } = request.body;
        const { user_id } = request.params; 

        const [note_id] = await knex("movie_notes").insert({
            title,
            description,
            user_id
        });
        const tagsInsert = tags.map(name => {
            return {
                note_id,
                name,
                user_id
            }
        });
        await knex("movie_tags").insert(tagsInsert);

        response.json(); 
    }
    async show(request, response){
        const { id } = request.params;

        const note = await knex("movie_notes").where({ id }).first();
        const tags = await knex("movie_tags").where({ note_id: id }).orderBy("name");

        return response.json({
            ...note, 
            tags
        });
    }
    async delete(request, response){
        const { id } = request.params;

        await knex("movie_notes").where({ id }).delete(); 

        return response.json();
    }
    async index(request, response){
        const { user_id, title, movie_tags } = request.query;

        let movie_notes;

        if(movie_tags) {
            const filterTags = movie_tags.split(',').map(movie_tag => movie_tag.trim());

            movie_notes = await knex("movie_notes")
            .select([
                "movie_notes.id",
                "movie_notes.title",
                "movie_notes.user_id", 
            ])
            .where("movie_notes_id", user_id)
            .whereLike("movie_notes.title", `%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("movie_notes", "notes_id", "movie_tags.note_id")
            .orderBy("movie_notes.title");

        }else{
            movie_notes = await knex("movie_notes")
                .where({ user_id })
                .whereLike("title", `%${title}%`)
                .orderBy("title");
        }

        const userTags = await knex("movie_tags").where({ user_id });
        const noteWithTags = movie_notes.map(movie_note => {
            const movie_noteTags = userTags.filter(movie_tag => tag.note_id === note_id); 

            return {
                ...movie_note,
                movie_tags: movie_noteTags  
            }
        })

        return response.json(noteWithTags); 
    }
}

module.exports = NotesController; 