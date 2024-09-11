const knex = require('../database/knex');


class OrdersController {
    async create(req, res) {
        const user_id = req.user.id;
        const { status, orders } = req.body;


        const [cart_id] = await knex('orders').insert({
            status,
            user_id
        });

        const orderItems = [];

        for (const order of orders) {
            const { title } = await knex('plates')
                .select('title')
                .where('id', order.plate_id)
                .first();

            const { quantity } = order;

            orderItems.push({
                title,
                quantity,
                cart_id,
                plate_id: order.plate_id
            });
        }

        await knex('cartItems').insert(orderItems);

        return res.status(201).json({ message: 'Pedido criado com sucesso' });
    }



    async update(req, res) {
        const { id, status } = req.body;

        await knex('orders').update({ status }).where('id', id);

        return res.json();
    }

    async index(req, res) {
        const user_id = req.user.id;

        const orders = await knex('orders')
            .where('user_id', user_id);

        const items = await knex('cartItems')
            .whereIn('cart_id', orders.map(order => order.id))
            .join('plates', 'cartItems.plate_id', 'plates.id')
            .select(
                'cartItems.id',  // Adicione o ID do item aqui
                'plates.title',
                'cartItems.quantity',
                'plates.price',
                'plates.image'
            );

        return res.json({ orders, items });
    }


    async removeItem(req, res) {
        const { id } = req.params;

        const item = await knex('cartItems').where('id', id).first();

        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado' });
        }

        await knex('cartItems').where('id', id).delete();
        return res.status(204).json();
    }




}

module.exports = OrdersController;