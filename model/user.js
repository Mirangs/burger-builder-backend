const pool = require('./db');

const getUsers = async () => {
  const results = await pool.query('SELECT * FROM "user"');
  return { data: [...results.rows], length: results.rowCount };
};

module.exports = {
  getUsers,
};
