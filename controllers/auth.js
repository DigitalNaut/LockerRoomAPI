const jwt = require("jsonwebtoken");
const users = require("./users.js");

const usernamePattern = /^([a-zA-Z0-9\.\_\-]{4,32})$/s;
const passwordPattern = /^([a-zA-Z0-9\!\@\#\$\%\^\&\*\)\(\+\=\,\.\_\-\ ]{6,24})$/s;
const usernameRequirementsBlurb =
  "The username must include at least one of: a-z, A-Z, 0-9, ._-, no spaces, and be of 4-32 characters in length.";
const passwordRequirementsBlurb =
  "Passwords must include at least one: a-z, A-Z, 0-9, !@#$%^&*()+=,._- and of 6-24 characters in length.";

exports.register = async function (req, res) {
  try {
    let username = req.body.username;

    let user = await users.get_user(username);
    if (user && username === user.username)
      return res
        .status(409)
        .json({ message: "Error creating user: User already exists." });

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
        return res.status(501).json({ message: "Error registering user." });

      return res.status(201).send(newUser.purge(true));
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Regestering new user was unsuccessful: " + error });
  }
};

exports.edit = async function (req, res) {
  try {
    return await users.modify_user(req);
  } catch (error) {
    return res.status(500).json({ message: "Could not update." });
  }
};

exports.login = async function (req, res) {
  try {
    let username = req.body.username;
    let role = req.body.role;

    let user = await users.get_user(username);

    if (!user) {
      return res.status(401).json({ message: "The username is not correct." });
    }

    if (!user.validPassword(req.body.password)) {
      return res.status(401).json({ message: "The password is not correct." });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRETKEY,
      {
        expiresIn: 36000,
      }
    );

    await users.set_auth_token(req.body.username, token);

    return res.status(200).json({
      message: "Authenticated successfully.",
      token,
      role: user.role,
      username: user.username
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error: Could not login: " + error });
  }
};

exports.logout = async function (req, res) {
  try {
    let username = req.headers.username;

    await users.set_auth_token(username, null);

    return res.status(200).json({
      message: "OK: Logged out successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Error: Could not logout: " + error });
  }
};

exports.remove = async function (req, res) {
  try {
    let user = req.headers.username;

    await users.delete_user(req);

    if (user)
      return res.status(200).json({ message: "OK: User account removed." });
    else
      return res
        .status(500)
        .json({ message: "Error: Could not delete an unknown user account." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal error: Could not delete user account." });
  }
};
