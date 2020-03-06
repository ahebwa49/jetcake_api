function verifyToken(req, res, next) {
  const userToken = req.headers.authorization;
  try {
    token = userToken.split(" ");
  } catch (e) {
    return res.status(401).send("unauthorized");
  }

  try {
    decoded = jwt.verify(token[1], process.env.APP_SECRET);
  } catch (e) {
    return res.status(401).send("unauthorized");
  }
  var userId = decoded.id;

  User.findOne({ _id: userId })
    .then(user => {
      req.user = user;
    })
    .catch(error => console.log(error));

  next();
}
module.exports = verifyToken;
