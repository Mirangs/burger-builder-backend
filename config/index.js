require('dotenv').config();

module.exports = {
  app: {
    PORT: process.env.PORT || 3000,
  },
  db: {
    host: process.env.HOST || 'localhost',
    port: process.env.DBPORT || 5432,
    name: process.env.DBNAME || 'burger_builder',
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
  },
};
