const express = require("express");
const mongo = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const auth = require("./auth");
const routes = require("./routes");

const upload = multer({ dest: "uploads/" });

const app = express();

app.use(express.static("uploads"));
// app.use("/static", express.static(path.join(__dirname, "uploads")));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  cors({
    origin: ["http://localhost:3000"], // restrict calls to those this address
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE" // allow all requests
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "pleasedonttellanybodyaboutthis",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongo.connect(process.env.MONGO_URI, (err, client) => {
  //client returned
  if (err) {
    console.log("Database error: " + err);
  } else {
    console.log("Successful database connection");

    //create a database object from the client object
    var db = client.db("jetcake");

    auth(app, db);

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
