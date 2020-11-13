var dotenv = require("dotenv").config();

const { response } = require("express");
const jwt = require("jsonwebtoken");
const { users } = require("../users");

const authenticate = async (req, res, next) => {
  const { token } = req.headers;

  users.get_user_by_token(
    token,
    (user) => next(),
    (err) => res.status(403).json({ message: "Forbidden" })
  );

  return null;
};

module.exports = authenticate;
