const bcrypt = require("bcrypt");
var ObjectID = require("mongodb").ObjectID;
const passport = require("passport");
const multer = require("multer");
var upload = multer({ dest: "uploads/" });

module.exports = function(app, db) {
  app.route("/").get((req, res) => {
    res.send("Welcome to jetcake REST authentication API");
  });

  // app.route("/image").post(upload.single("avatar"), function(req, res, next) {
  //   console.log("profile image has been uplaoded");
  //   console.log(req.file);
  //   console.log(req.body);
  //   res.status(200).json(req.file);
  //   // req.file is the `avatar` file
  //   // req.body will hold the text fields, if there were any
  // });

  app.route("/signup").post(
    upload.single("avatar"),
    (req, res, next) => {
      console.log("signup endpoint has been hit");
      // console.log(req.file);
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
      console.log("successfully registered");
      console.log(req.user);
      res.json(req.user);
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
        res.json(req.user);
        console.log(`Successful login ${req.user}`);
      });
    })(req, res, next);
  });

  app.route("/profile").get((req, res) => {
    if (req.user) {
      console.log("Authenticated on navigating to profile");
      return res.json(req.user);
    } else {
      console.log("Not Authenticated on navigating to profile");
    }
  });

  app.route("/profile/edit/:id").put(upload.single("avatar"), (req, res) => {
    console.log("update endpoint hit");

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
            console.log("one document has been updated");
            return res.json(user);
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
            console.log("one document has been updated");
            return res.json(user);
          }
        }
      );
    }
  });

  app.route("/logout").get((req, res) => {
    if (req.isAuthenticated()) {
      console.log("Authenticated just before logout");
      console.log(req.user);
    } else {
      console.log("Not authenticated before logout");
    }
    req.logout();
    console.log("successfully logged out");
    console.log(req.user);
    res.json(req.user);
  });
};
