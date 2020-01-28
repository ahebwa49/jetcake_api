const bcrypt = require("bcrypt");
var ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  app.route("/").get((req, res) => {
    res.send("Welcome to jetcake REST authentication API");
  });

  app.route("/login").post((req, res, next) => {
    console.log("signin endpoint has been hit");
  });

  app.route("/signup").post((req, res, next) => {
    console.log("signup endpoint has been hit");
  });
};
