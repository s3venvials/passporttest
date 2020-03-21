const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("../models/user").User;
const bcrypt = require("bcryptjs");

let passportService = (app) => {
  try {
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
      res.locals.currentUser = req.user;
      res.locals.session = req.session;
      return next();
    });

    passport.use(new LocalStrategy(
      (username, password, done) => {
        UserModel.find({})
          .then(users => {

            for (var i = 0; i < users.length; i++) {

              if (bcrypt.compareSync(username, users[i].username)) {

                if (!UserModel.validatePassword(password, users[i].hash)) return done(null, false, { error: "Password is invalid." });

                return users[i];
              }
            }
          }).then((user) => {
            return done(null, user);
          }).catch(done);
      }));

    passport.serializeUser(function (user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
      UserModel.findById(id, function (err, user) {
        done(err, user);
      });
    });

  } catch (error) {

    return Promise.reject(error);
  }
}

module.exports = { passportService };