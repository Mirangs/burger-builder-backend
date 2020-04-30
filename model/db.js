const Pool = require('pg').Pool;
const {
  db: { host, name: database, port, user, password },
} = require('../config');

module.exports = new Pool({
  user,
  host,
  database,
  password,
  port,
});
