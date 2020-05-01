const pool = require('./db');

const getOrdersByUserId = async (id) => {
  const orders = await pool.query(
    `SELECT * FROM "order" WHERE user_id = ${id}`
  );
  const results = Promise.all(
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

  return results;
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

module.exports = {
  getOrdersByUserId,
  addOrder,
};
