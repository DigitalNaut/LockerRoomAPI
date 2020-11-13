const models = require("../models");

// CREATE
exports.new_user = async function (req, res) {
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
    console.log("New user: ", user);

    return user
      .save()
      .then((user) => {
        return (res && res.status(201).send(user)) || user;
      })
      .catch((error) => {
        console.log("Error saving user to database:", error.message);
        return (
          (res &&
            res
              .status(420)
              .send({ message: "Could not save new user to database." })) ||
          null
        );
      });
  } else {
    console.log("Built user is null!");
    return (
      (res && res.status(503).send({ message: "Failed to build new user." })) ||
      null
    );
  }
};

// READ

exports.get_user_by_token = async function (token, callback, failback) {
  return models.User.findOne({
    where: { authToken: token },
  })
    .then((user) => {
      if (user) return callback(user);
      else failback(user);
    })
    .catch((err) => failback(err));
};

exports.get_all_users = function (req, res) {
  return models.User.findAll()
    .then((users) => {
      if (users.length) return (res && res.status(200).send(users)) || users;
      else return res.status(501).send({ message: "No users found" });
    })
    .catch((err) => {
      console.log("Error fetching users:", err);
      return (
        (res && res.status(500).send({ message: "Failed to fetch users." })) ||
        null
      );
    });
};

exports.get_user = function (req, res) {
  return models.User.findOne({
    where: {
      username: req.params.username || req.body.username,
    },
  })
    .then((user) => {
      if (user) return (res && res.status(200).send(user)) || user;
      else
        return (
          (res && res.status(404).send({ message: "User not found" })) || null
        );
    })
    .catch((err) => {
      console.log("Error ocurred fetching a user:", err);
      return (
        (res &&
          res
            .status(500)
            .send({ code: err.code, message: "Error fetching user" })) ||
        null
      );
    });
};

// UPDATE

exports.set_auth_token = async function (username, token) {
  return await models.User.findOne({
    where: { username: username },
  })
    .then((user) => user.update({ authToken: token }))
    .catch((err) => {
      console.log("Error: User can't accept token:" + err);
      return err;
    });
};

exports.modify_user = function (req, res) {
  return models.User.findOne({
    where: {
      authToken: req.headers.token,
    },
  })
    .then((user) => {
      if (user)
        user
          .update(req.body)
          .then((user) => {
            return (res && res.status(202).send(user)) || user;
          })
          .catch((err) => {
            console.log("Error updating user:" + err);
            return (res && res.status(304).send(user)) || user;
          });
      else
        return (
          (res && res.status(404).send({ message: "User not found." })) || null
        );
    })
    .catch((err) => {
      console.log("An error ocurred fetching a user:", err);
      return (
        (res &&
          res
            .status(500)
            .send({ code: err.code, message: "Error fetching user." })) ||
        null
      );
    });
};

// DELETE

exports.delete_user = function (req, res) {
  return models.User.findOne({
    where: {
      authToken: req.headers.token,
    },
  })
    .then((user) => {
      if (!user)
        return (
          (res && res.status(400).send({ message: "User not found." })) || user
        );

      return user
        .destroy()
        .then(() => {
          return (
            (res && res.status(200).send({ message: "User removed: " + user })) || null
          );
        })
        .catch((err) => {
          console.log("Error deleting user:" + err);
          return (res && res.status(304).send(user)) || user;
        });
    })
    .catch((err) => {
      console.log("Error deleting user:" + err);
      return (
        (res &&
          res
            .status(500)
            .send({ message: `Error: Could not remove user: ${err}.` })) ||
        err
      );
    });
};

exports.users = { ...exports };
