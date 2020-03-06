const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.static("uploads"));

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const db = mongoose.connect(
  "mongodb+srv://jetcake:jetcake@jetcake-el6cq.mongodb.net/test?retryWrites=true"
);

const User = require("./models/userModel");

const userRouter = require("./routes/userRouter")(User);

app.use("/api", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to my REST API");
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
