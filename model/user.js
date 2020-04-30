const pool = require('./db');
const bcrypt = require('bcrypt');

const getUsers = async () => {
  const results = await pool.query('SELECT * FROM "user"');
  return { data: [...results.rows], length: results.rowCount };
};

const getUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM "user" WHERE email='${email}'`
  );
  if (result.rowCount === 0) {
    return { message: 'There is no user with this email' };
  }

  return result.rows[0];
};

const getUserById = async (id) => {
  const result = await pool.query(`SELECT * FROM "user" WHERE id=${id}`);

  if (result.rowCount === 0) {
    return { message: 'There is no user with this id' };
  }

  return result.rows[0];
};

const getUserRoles = async () => {
  const result = await pool.query(
    `SELECT * FROM user_role WHERE name <> 'Administrator'`
  );
  return result.rows;
};

const addUser = async (userData) => {
  const {
    email,
    password,
    deliveryMethod,
    street,
    zipCode,
    country,
    role,
    phone,
  } = userData;
  const res = await pool.query(
    `SELECT * FROM "user" WHERE email = '${userData.email}'`
  );
  if (res.rowCount !== 0) {
    return { message: 'User with this email is alreaty exists!' };
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const insert = await pool.query(
      `INSERT INTO "user" VALUES(DEFAULT, '${email}', '${hashedPassword}', ${
        deliveryMethod === 'fastest' ? false : true
      }, '${street}', ${zipCode}, ${country}, ${role}, '${phone}')`
    );
    return insert.rowCount;
  } catch (err) {
    return { message: err };
  }
};

module.exports = {
  getUsers,
  getUserByEmail,
  getUserRoles,
  addUser,
  getUserById,
};
