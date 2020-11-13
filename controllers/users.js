const models = require("../models");

// CREATE
exports.new_user = async function (req, res) {
  try {
    let user = await models.User.build({
      username: req.body.username,
      role: "user",
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      DOB: req.body.DOB,
      address: req.body.address,
      phone: req.body.phone,
      picture: req.body.picture,
    });

    if (user) {
      await user.save();
      return (res && res.status(201).send(user)) || user;
    } else {
      console.log("Built user is null!");
      return (
        (res &&
          res.status(503).send({ message: "Failed to build new user." })) ||
        null
      );
    }
  } catch (error) {
    console.log("Error saving user to database:", error.message);
    return (
      (res &&
        res
          .status(420)
          .send({ message: "Could not save new user to database." })) ||
      null
    );
  }
};

// READ

exports.get_all_users = async function (req, res) {
  try {
    let users = await models.User.findAll();

    if (users.length) return (res && res.status(200).send(users)) || users;
    else return res.status(501).send({ message: "No users found" });
  } catch (error) {
    console.log("Error fetching users:", error);
    return (
      (res && res.status(500).send({ message: "Failed to fetch users." })) ||
      null
    );
  }
};

exports.get_user = async function (req, res) {
  try {
    let user = await models.User.findOne({
      where: {
        username: req.params.username || req.body.username,
      },
    });

    if (user) return (res && res.status(200).send(user)) || user;
    else
      return (
        (res && res.status(404).send({ message: "User not found" })) || null
      );
  } catch (error) {
    console.log("Error ocurred fetching a user:", error);
    return (
      (res &&
        res
          .status(500)
          .send({ code: error.code, message: "Error fetching user" })) ||
      null
    );
  }
};

exports.get_user_by_token = async function (token, callback, failback) {
  try {
    let user = await models.User.findOne({
      where: { authToken: token },
    });

    if (user) return callback(user);
    else return failback(user);
  } catch (error) {
    console.log("Error getting User by Token:", error);
    throw error;
  }
};

// UPDATE

exports.set_auth_token = async function (username, token) {
  try {
    let user = await models.User.findOne({
      where: { username: username },
    });

    await user.update({ authToken: token });
  } catch (error) {
    console.log("Error: User can't accept token:" + error);
    return error;
  }
};

exports.modify_user = async function (req, res) {
  try {
    let user = await models.User.findOne({
      where: {
        authToken: req.headers.token,
      },
    });

    if (user) {
      await user.update(req.body);
      return (res && res.status(202).send(user)) || user;
    } else
      return (
        (res && res.status(404).send({ message: "User not found." })) || null
      );
  } catch (error) {
    console.log("Error updating user:" + error);
    return (res && res.status(304).send(user)) || user;
  }
};

// DELETE

exports.delete_user = async function (req, res) {
  try {
    let user = await models.User.findOne({
      where: {
        authToken: req.headers.token,
      },
    });
    if (!user)
      return (
        (res && res.status(400).send({ message: "User not found." })) || user
      );

    await user.destroy();

    return (
      (res && res.status(200).send({ message: "User removed: " + user.username })) ||
      null
    );
  } catch (error) {
    console.log("Error deleting user:" + error);
    return (
      (res &&
        res
          .status(500)
          .send({ message: `Error: Could not remove user: ${error}.` })) ||
      error
    );
  }
};

exports.users = { ...exports };
