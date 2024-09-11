exports.up = knex => knex.schema.createTable('cartItems', table => {
    table.increments('id');
    table.text('cart_id').references('id').inTable('orders').onDelete('CASCADE');

    table.text('plate_id').references('id').inTable('plates');
    table.text('title')
    table.text('quantity');
    table.timestamp("created_at").default(knex.fn.now())

});

exports.down = knex => knex.schema.dropTable('cartItems');