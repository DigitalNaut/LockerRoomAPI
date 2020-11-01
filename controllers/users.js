const models = require("../models");

exports.show_users = function (req, res) {
  return models.User.findAll()
    .then((users) => {
      if (users.length) res.status(200).send(users);
      else res.status(501).send(["No users found"]);
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
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(404).send({ message: "No such user found: " + err.message });
    });
};

  return models.User.build({
exports.remove_user = function (req, res) {
    id: req.body.id,
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    DOB: req.body.DOB,
    address: req.body.address,
    phone: req.body.phone,
    picture: req.body.picture,
  })
    .then((user) => {
      return newUser
        .save()
        .then(() => {
          res.status(201).send(newUser);
        })
        .catch((error) => {
          res
            .status(420)
            .send({ message: "Could not save new user to database." });
          console.log("Error saving user to database:", error.message);
        });
    })
    .catch((err) => {
      res.status(503).send({ message: "Failed to build new user." });
      console.log("Error building user:", error.message);
    });
};
