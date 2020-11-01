const models = require("../models");

exports.show_users = function (req, res) {
  return models.User.findAll()
    .then((users) => {
      if (users.length) res.status(200).send(users);
      else res.status(501).send({ message: "No users found" });
    })
    .catch((err) => {
      res.status(500).send({ message: "Failed to fetch users." });
      console.log("Error fetching users:", error.message);
    });
};

exports.show_user = function (req, res) {
  return models.User.findOne({
    where: {
      id: parseInt(req.params.id),
    },
  })
    .then((user) => {
      if (user) res.status(200).send(user);
      else res.status(404).send({ message: "User not found." });
    })
    .catch((err) => {
      res.status(500).send({ code: err.code, message: "Error fetching user." });
      console.log("An error ocurred fetching a user:", err.message);
    });
};

exports.remove_user = function (req, res) {
  return models.User.findOne({
    where: {
      id: parseInt(req.params.id),
    },
  })
    .then((user) => {
      user
        .destroy()
        .then(() => {
          res.status(200).send({ message: "User removed." });
        })
        .catch((err) => {
          res.status(304).send(user);
          console.log("Error deleting user:" + err.message);
        });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error: Could not remove user." });
      console.log("Error deleting user:" + err.message);
    });
};

exports.edit_user = function (req, res) {
  return models.User.findOne({
    where: {
      id: parseInt(req.params.id),
    },
  })
    .then((user) => {
      if (user)
        user
          .update(req.body)
          .then((user) => {
            res.status(202).send(user);
          })
          .catch((err) => {
            res.status(304).send(user);
            console.log("Error updating user:" + err.message);
          });
      else res.status(404).send({ message: "User not found." });
    })
    .catch((err) => {
      res.status(500).send({ code: err.code, message: "Error fetching user." });
      console.log("An error ocurred fetching a user:", err.message);
    });
};

exports.new_user = function (req, res) {
  let user = models.User.build({
    id: req.body.id,
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
    console.log("Built a user");
    return user
      .save()
      .then((user) => res.status(201).send(user))
      .catch((error) => {
        console.log("Error saving user to database:", error.message);
        return res
          .status(420)
          .send({ message: "Could not save new user to database." });
      });
  } else {
    console.log("Built user is null!");
    return res.status(503).send({ message: "Failed to build new user." });
  }
};
