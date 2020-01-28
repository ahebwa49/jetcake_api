const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local");
const ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  //serialization

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  //deserialization

  passport.deserializeUser((id, done) => {
    db.collection("users").findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null, doc);
    });
  });

  passport.use(
    new LocalStrategy(function(username, password, done) {
      db.collection("users").findOne({ username: username }, function(
        err,
        user
      ) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );
};
