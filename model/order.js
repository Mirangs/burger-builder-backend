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

const getOrdersForCourier = async () => {
  const result = await pool.query(`
    SELECT "order".id, total_price, phone, "user".name AS user_name, order_status_id, restaurant.street AS from, "user".id as user_id, "user".street AS to, delivery_method, zip_code
    FROM "order" 
    INNER JOIN "user" ON "user".id = "order".user_id 
    INNER JOIN restaurant ON restaurant.id = "order".restaurant_id
    WHERE order_status_id = 4 OR order_status_id = 5 
  `);

  return result.rows;
};

const getOrdersByRestaurant = async (id) => {
  const orders = await pool.query(
    `
      SELECT "order".id, total_price, "user".phone AS user_phone, "user".name AS user_name, order_status_id AS order_status, order_date, "user".id as user_id
      FROM "order" 
      INNER JOIN "user" ON "user".id = "order".user_id 
      WHERE restaurant_id = ${id}
    `
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

  return results;
};

const getOrderStatuses = async () => {
  const result = await pool.query('SELECT * FROM order_status');
  return result.rows;
};

const updateOrder = async (orderData) => {
  const { id, total_price, user_id, order_status } = orderData;

  const inserted = await pool.query(`
    UPDATE "order"
    SET total_price = ${total_price}, user_id = ${user_id}, order_status_id = ${order_status}
    WHERE "order".id = ${id}
    RETURNING id
  `);

  return inserted.rows[0].id;
};

module.exports = {
  getOrdersByUserId,
  addOrder,
  getOrdersCountByUser,
  getOrdersByRestaurant,
  getOrderStatuses,
  getOrdersForCourier,
  updateOrder,
};
