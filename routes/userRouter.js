const express = require("express");
const multer = require("multer");
var upload = multer({ dest: "uploads/" });
const userController = require("../controllers/userController");

function routes(User) {
  const userRouter = express.Router();
  const controller = userController(User);

  userRouter
    .route("/register")
    .post(upload.single("avatar"), controller.Register);
  userRouter.route("/login").post(controller.Login);
  userRouter.route("/profile").get(controller.Profile);
  userRouter
    .route("/profile/edit/:id")
    .put(upload.single("avatar"), controller.EditProfile);

  return userRouter;
}

module.exports = routes;
