var dotenv = require('dotenv').config();

const jwt = require("jsonwebtoken");
const users = require("./users.js");

const usernamePattern = /^([a-zA-Z0-9\.\_\-]{4,32})$/s;
const passwordPattern = /^([a-zA-Z0-9\!\@\#\$\%\^\&\*\)\(\+\=\,\.\_\-\ ]{6,24})$/s;
const usernameRequirementsBlurb =
  "The username must include at least one of: a-z, A-Z, 0-9, ._-, no spaces, and be of 4-32 characters in length.";
const passwordRequirementsBlurb =
  "Passwords must include at least one: a-z, A-Z, 0-9, !@#$%^&*()+=,._- and of 6-24 characters in length.";

exports.register = function (req, res) {
  return users.get_user(req).then((user) => {
    if (user)
      return res.status(400).json({ message: "Username not available." });

    if (!req.body.username.match(usernamePattern))
      return res.status(400).json({
        message: `Password is not valid: ${usernameRequirementsBlurb}`,
      });

    if (!req.body.password.match(passwordPattern))
      return res.status(400).json({
        message: `Password is not valid: ${passwordRequirementsBlurb}`,
      });

    return users.new_user(req).then((newUser) => {
      if (!newUser)
        return res.status(500).json({ message: "Error registering user." });

      return res.status(201).send(newUser);
    });
  });
};

exports.edit = function (req, res) {
  return users.modify_user(req);
};

exports.login = async function (req, res) {
  let user = await users.get_user(req);

  if (!user) {
    return res.status(401).json({ message: "The username is not correct." });
  }

  if (!user.validPassword(req.body.password)) {
    return res.status(401).json({ message: "The password is not correct." });
  }

  const token = jwt.sign(
    { userUsername: user.username, userRole: user.role },
    process.env.JWT_SECRETKEY,
    {
      expiresIn: 36000,
    }
  );

  await users.set_auth_token(req.body.username, token);

  return res.status(200).json({
    message: "Authenticated successfully.",
    token,
  });
};

exports.logout = async function (req, res) {
  let user = await users.get_user(req);

  if (!user) return res.status(401).json({ message: "Unknown user" });

  
  await users.set_auth_token(req.body.username, null);

  return res.status(200).json({
    message: "Logged out successfully."
  });
};

exports.remove = function (req, res) {
  if (!users.delete_user(req.params.username))
    return res
      .status(400)
      .json({ message: "Can not remove an invalid username." });

  let user = users.delete_user(req);

  if (user) return res.status(200).json({ message: "User account removed." });
  else
    return res
      .status(500)
      .json({ message: "Internal error: Could not delete user account." });
};
