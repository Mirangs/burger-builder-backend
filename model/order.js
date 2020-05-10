const pool = require('./db');

const getOrdersByUserId = async ({ id, limit, offset, orderBy }) => {
  const searhQuery = `user_id = ${id} ORDER BY total_price ${
    orderBy === 'asc' ? 'ASC' : orderBy === 'desc' ? 'DESC' : ''
  }`;

  const orders = await pool.query(
    `SELECT "order".id, total_price, user_id, restaurant_id, order_status.name as order_status, order_date FROM "order" INNER JOIN order_status ON order_status.id = order_status_id WHERE ${searhQuery} LIMIT ${limit} OFFSET ${offset}`
  );
  const count = await pool.query(
    `SELECT COUNT(*) FROM "order" WHERE user_id = ${id}`
  );
  const results = await Promise.all(
    orders.rows.map(async (order) => {
      const ingredients = await pool.query(
        `SELECT ingredient.name, amount FROM order_ingredient INNER JOIN ingredient ON ingredient.id = order_ingredient.ingredient_id WHERE order_id = ${order.id}`
      );

      return {
        ...order,
        ingredients: ingredients.rows,
      };
    })
  );

  return {
    count: count.rows[0].count,
    orders: [...results],
  };
};

const addOrder = async (orderData) => {
  const { price, id, ingredients } = orderData;

  try {
    //TODO: remove mocks
    const insert = await pool.query(
      `INSERT INTO "order" VALUES(DEFAULT, ${price}, ${id}, 2, 1, DEFAULT, 4) RETURNING id`
    );
    const insertId = insert.rows[0].id;

    ingredients.forEach(async (ingredient) => {
      await pool.query(
        `INSERT INTO order_ingredient VALUES(DEFAULT, ${ingredient.amount}, ${insertId}, ${ingredient.id})`
      );
    });

    return insertId;
  } catch (err) {
    return { message: err };
  }
};

const getOrdersCountByUser = async (id) => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM "order" WHERE user_id = ${id}`
  );
  return result.rows[0].count;
};

module.exports = {
  getOrdersByUserId,
  addOrder,
  getOrdersCountByUser,
};
