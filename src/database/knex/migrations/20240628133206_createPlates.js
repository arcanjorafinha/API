exports.up = knex => knex.schema.createTable("plates", table => {
    table.increments("id");
    table.text("title");
    table.text("description");
    table
        .enum('category', ['refeições', 'bebidas', 'sobremesas'], { useNative: true, enumName: 'categories' })
        .notNullable()
        .defaultTo('refeições');
    table.text("price");
    table.text("image");
});

exports.down = knex => knex.schema.dropTable("plates");
