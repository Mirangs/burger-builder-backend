const express = require('express');
const router = express.Router();

const { getUsers, getUserByEmail, getUserRoles } = require('../model/user');

router.get('/', async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

router.get('/roles', async (req, res) => {
  const roles = await getUserRoles();
  res.json(roles);
});

router.get('/:email', async (req, res) => {
  const user = await getUserByEmail(req.params.email);
  res.json(user);
});

module.exports = router;
