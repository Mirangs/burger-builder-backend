const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { getUserByEmail } = require('../model/user');
const bcrypt = require('bcrypt');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function (email, password, cb) {
      try {
        const user = await getUserByEmail(email);
        if (user.message) {
          return cb({ message: user.message }, false);
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return cb({ message: 'Incorrect login or password' }, false);
        }

        cb(null, user, { message: 'Logged in successfully' });
      } catch (err) {
        return cb(err, false);
      }
    }
  )
);
