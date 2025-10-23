const verifyTokenEmail = (req, res, next) => {
  if (req.query.userEmail !== req.decoded.email) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  next();
};

module.exports = verifyTokenEmail;
