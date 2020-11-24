const models = require("../models");

// CREATE
exports.new_user = async function (req) {
  try {
    let {
      body: {
        username,
        email,
        password,
        firstName,
        lastName,
        DOB,
        address,
        phone,
        picture,
      },
    } = req;

    let = user = await models.User.build({
      username: username,
      role: "user",
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      DOB: DOB,
      address: address,
      phone: phone,
      picture: picture,
    });

    await user.save();

    return user;
  } catch (error) {
    console.log("Error saving user to database:" + error);
    return null;
  }
};

// READ

exports.show_all_users = async function (req, res) {
  try {
    let role = req.headers.role;
    let username = req.headers.username;

    let users = await getAllUsers();

    if (!users.length)
      return res.status(501).json({ message: "No users found" });

    users = users.map((user) => {
      user = user.purge(role, user.username === username);
      user.loggedIn = user.authToken ? true : false;
      return user;
    });

    return res.status(200).send(users);
  } catch (error) {
    //console.log("Error fetching users:", error);
    return res
      .status(500)
      .json({ message: "Internal Error: Failed to fetch users." });
  }
};

const getAllUsers = async function () {
  let users = await models.User.findAll();

  users.forEach((user) => {
    user.loggedIn = true;
  });

  return users;
};

exports.show_user = async function (req, res) {
  try {
    let username = req.params.username;

    let role = req.headers.role;

    let user = await exports.get_user(username);

    if (!user)
      return res.status(404).json({ message: "User not found: " + user });

    console.log("MY username: ", username, "The other: ", user.username);

    user = user.purge(role, user.username === username);
    user.loggedIn = user.authToken ? true : false;

    return res && res.status(200).send(user);
  } catch (error) {
    console.log("Error ocurred fetching a user:", error);
    return res
      .status(500)
      .send({ code: error.code, message: "Error fetching user" });
  }
};

exports.get_user = async function (username) {
  try {
    let user = await models.User.findOne({
      where: {
        username: username,
      },
    });

    return user;
  } catch (error) {
    console.log("Error getting a user: " + error);
    return null;
  }
};

exports.get_user_from_token = async function (token, callback, failback) {
  try {
    if (!token) throw "Token is invalid: " + token;

    let user = await models.User.findOne({
      where: { authToken: token },
    });

    if (!user) return failback(user);

    return callback(user);
  } catch (error) {
    throw error;
  }
};

// UPDATE

exports.set_auth_token = async function (username, token) {
  try {
    let user = await models.User.findOne({
      where: { username: username },
    });

    return await user.update({ authToken: token });
  } catch (error) {
    console.log("Error: Cant set token for user: " + error);
    return error;
  }
};

exports.reset_password = async function (req, res) {
  try {
    let username = req.headers.username;

    if (!req.body.newPassword1)
      res.status(403).json({
        message: "Bad request: The new password provided is empty.",
      });

    if (req.body.newPassword1 !== req.body.newPassword2)
      res.status(403).json({
        message: "Bad request: The verification password does not match.",
      });

    let user = await models.User.findOne({
      where: { username: username },
    });

    let newProperties = { password: req.body.newPassword1 };

    await user.update(newProperties);

    user = user.purge(role, user.username === username);

    return res && res.status(202).send(user);
  } catch (error) {
    console.log("Error updating user:" + error);
    return (
      res &&
      res
        .status(304)
        .json({ message: "Internal Error: Could not update user: " + error })
    );
  }
};

exports.modify_user = async function (req, res) {
  try {
    let username = req.headers.username;

    let user = await models.User.findOne({
      where: { username: username },
    });

    let newProperties = {};
    if (req.body.email) newProperties.email = req.body.email;
    if (req.body.firstName) newProperties.firstName = req.body.firstName;
    if (req.body.DOB) newProperties.DOB = req.body.DOB;
    if (req.body.address) newProperties.address = req.body.address;
    if (req.body.phone) newProperties.phone = req.body.phone;

    await user.update(newProperties);

    user = user.purge(role, user.username === username);

    return res && res.status(202).send(user);
  } catch (error) {
    console.log("Error updating user:" + error);
    return (
      res && res.status(500).send("Internal Error: Could not update user.")
    );
  }
};

// DELETE

exports.delete_user = async function (req, res) {
  try {
    let username = req.headers.username;

    let user = await models.User.findOne({
      where: {
        username: username,
      },
    });

    if (!user)
      return res
        .status(400)
        .send({ message: "No change: User does not exist." });

    await user.destroy();

    return (
      (res &&
        res.status(200).json({ message: "User removed: " + user.username })) ||
      null
    );
  } catch (error) {
    console.log(`Error: Could not remove user: ${error}.`);
    return (
      (res &&
        res
          .status(500)
          .send({ message: "Internal Error: Removing user failed." })) ||
      error
    );
  }
};

exports.users = { ...exports };
