const pool = require('./db');

const getIngredients = async () => {
  const results = await pool.query('SELECT * FROM ingredient');
  return results.rows.map((ingredient) => ({ ...ingredient, amount: 0 }));
};

module.exports = {
  getIngredients,
};
