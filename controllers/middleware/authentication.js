require("dotenv").config();
var dotenv = require("dotenv").config();

const { response } = require("express");
const jwt = require("jsonwebtoken");
const { users } = require("../users");

const authenticate = async (req, res, next) => {
  const { token } = req.headers;

  await users.get_user_by_token(
    token,
    (user) => {
      if (jwt.verify(user.token, process.env.JWT_SECRETKEY)) return next();
      else
        return res
          .status(403)
          .json({ message: "Forbidden: Invalid credentials" });
    },
    (error) =>
      res.status(403).json({
        message: `Authentication Error: ${error ? error : "User not logged in."}`,
      })
  );

  return null;
};

module.exports = authenticate;
