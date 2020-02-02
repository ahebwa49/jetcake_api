const bcrypt = require("bcrypt");
var ObjectID = require("mongodb").ObjectID;
const passport = require("passport");
const multer = require("multer");
var upload = multer({ dest: "uploads/" });

module.exports = function(app, db) {
  app.route("/").get((req, res) => {
    res.send("Welcome to jetcake REST authentication API");
  });

  app.route("/signup").post(
    upload.single("avatar"),
    (req, res, next) => {
      db.collection("users").findOne({ username: req.body.username }, function(
        err,
        user
      ) {
        if (err) {
          next(err);
        } else if (user) {
          res.status(400).send({
            error:
              "The email address you have entered is already associated with another account."
          });
        } else {
          var profile = `http://localhost:4000/${req.file.filename}`;

          var hash = bcrypt.hashSync(req.body.password, 12);
          db.collection("users").insertOne(
            {
              username: req.body.username,
              profile: profile,
              phoneNumber: req.body.phoneNumber,
              address: req.body.address,
              nickname: req.body.nickname,
              dateOfBirth: req.body.dateOfBirth,
              book: req.body.book,
              spouse: req.body.spouse,
              password: hash
            },
            (err, doc) => {
              if (err) {
                Console.log("Error inserting the user");
                res.redirect("http://localhost:3000/");
              } else {
                next(null, user);
              }
            }
          );
        }
      });
    },
    passport.authenticate("local", {
      failureRedirect: "http://localhost:3000/register"
    }),
    (req, res, next) => {
      const newUser = Object.assign({}, req.user, { password: null });
      res.json(newUser);
    }
  );

  app.route("/signin").post(function(req, res, next) {
    passport.authenticate("local", function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).send({
          error: "Invalid username or password"
        });
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        const newUser = Object.assign({}, req.user, { password: null });
        res.json(newUser);
      });
    })(req, res, next);
  });

  app.route("/profile").get((req, res) => {
    if (req.user) {
      const user = Object.assign({}, req.user, { password: null });
      return res.json(user);
    } else {
      return res.json(req.user);
    }
  });

  app.route("/profile/edit/:id").put(upload.single("avatar"), (req, res) => {
    if (req.file) {
      var profile = `http://localhost:4000/${req.file.filename}`;

      db.collection("users").updateOne(
        { _id: ObjectID(req.params.id) },
        {
          $set: {
            profile: profile,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            nickname: req.body.nickname,
            dateOfBirth: req.body.dateOfBirth,
            book: req.body.book,
            spouse: req.body.spouse
          }
        },
        (err, user) => {
          if (err) {
            return res.send(err);
          } else {
            return res.status(200).send();
          }
        }
      );
    } else {
      db.collection("users").updateOne(
        { _id: ObjectID(req.params.id) },
        {
          $set: {
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            nickname: req.body.nickname,
            dateOfBirth: req.body.dateOfBirth,
            book: req.body.book,
            spouse: req.body.spouse
          }
        },
        (err, user) => {
          if (err) {
            return res.send(err);
          } else {
            return res.status(200).send();
          }
        }
      );
    }
  });

  app.route("/logout").get((req, res) => {
    req.logout();
    res.json(req.user);
  });
};
