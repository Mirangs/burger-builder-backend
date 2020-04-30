const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { addUser } = require('../model/user');

const {
  jwt: { secret },
} = require('../config');

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ err: err.message });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const updatedUser = {
        id: user.id,
        email: user.email,
        role: user.user_role_id,
      };
      const token = jwt.sign(updatedUser, secret);
      return res.json({
        user: updatedUser,
        token,
      });
    });
  })(req, res);
});

router.post('/register', async (req, res) => {
  const insert = await addUser(req.body);
  if (insert.message) {
    return res.status(500).json({ err: insert.message });
  }
  res.json(insert);
});

module.exports = router;
