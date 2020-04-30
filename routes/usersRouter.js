const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserByEmail,
  getUserRoles,
  getUserById,
} = require('../model/user');

router.get('/', async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

router.get('/roles', async (req, res) => {
  const roles = await getUserRoles();
  res.json(roles);
});

router.get('/by-email/:email', async (req, res) => {
  const user = await getUserByEmail(req.params.email);
  res.json(user);
});

router.get('/by-id/:id', async (req, res) => {
  const user = await getUserById(req.params.id);
  if (user.message) {
    return res.json({ err: user.message });
  }

  return res.json(user);
});

module.exports = router;
