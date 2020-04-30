const express = require('express');
const router = express.Router();

const { getUsers } = require('../model/user');

router.get('/', async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

module.exports = router;
