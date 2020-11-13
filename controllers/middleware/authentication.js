var dotenv = require("dotenv").config();

const { response } = require("express");
const jwt = require("jsonwebtoken");
const { users } = require("../users");

const authenticate = async (req, res, next) => {
  const { token } = req.headers;

  await users.get_user_by_token(
    token,
    (user) => next(),
    (error) =>
      res.status(403).json({
        message: `${
          error
            ? "Authentication Error: " + error.message
            : "Forbidden: Invalid credentials"
        }`,
      })
  );

  return null;
};

module.exports = authenticate;
