const pool = require('./db');

const getCountries = async () => {
  const results = await pool.query('SELECT * FROM country');
  return { data: [...results.rows], length: results.rowCount };
};

const getCountryById = async (id) => {
  const results = await pool.query(`SELECT * FROM country WHERE id = ${id}`);
  return results.rows[0];
};

module.exports = {
  getCountries,
  getCountryById,
};
