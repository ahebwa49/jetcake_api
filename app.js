const express = require("express");
const mongo = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  cors({
    origin: ["http://localhost:3001"], // restrict calls to those this address
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE" // allow all requests
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongo.connect(process.env.MONGO_URI, (err, client) => {
  //client returned
  if (err) {
    console.log("Database error: " + err);
  } else {
    console.log("Successful database connection");

    //create a database object from the client object
    var db = client.db("swipe2pay");

    // auth(app, db);

    routes(app, db);

    app.use((req, res, next) => {
      res
        .status(404)
        .type("text")
        .send("Not Found");
    });

    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });
  }
});
