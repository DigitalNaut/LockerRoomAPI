const models = require("../models");

// CREATE

exports.new_petition = async function (req, res) {
  let user = await models.User.findOne({
    where: {
      id: req.body.userId,
    },
  });

  if (!user) {
    console.log("Bad request: creating a petition requires an existing user");
    return res
      .status(400)
      .send({ message: "The petition requires an existing user" });
  }

  let petition = models.Petition.build({
    userId: req.body.userId,
    type: req.body.type,
    code: req.body.code,
    enclosure: req.body.enclosure,
    result: "pending",
  });

  if (petition) {
    return petition
      .save()
      .then((petition) => res.status(201).send(petition))
      .catch((error) => {
        console.log("Error saving petition to database:", error.message);
        return res
          .status(420)
          .send({ message: "Could not save new petition to database." });
      });
  } else {
    console.log("Built petition is null!");
    return res.status(503).send({ message: "Failed to build new petition." });
  }
};

// READ

exports.get_all_petitions = function (req, res) {
  return models.Petition.findAll()
    .then((petitions) => {
      if (petitions.length) res.status(200).send(petitions);
      else res.status(501).send({ message: "No petitions found" });
    })
    .catch((err) => {
      res.status(500).send({ message: "Failed to fetch petitions." });
      console.log("Error fetching petitions:", err);
    });
};

exports.get_petition = function (req, res) {
  return models.Petition.findOne({
    where: {
      id: parseInt(req.params.id),
    },
  })
    .then((petition) => {
      if (petition) res.status(200).send(petition);
      else res.status(404).send({ message: "Petition not found" });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error fetching petition" });
      console.log("Error fetching petition: " + err);
    });
};

// UPDATE

exports.edit_petition = function (req, res) {
  return models.Petition.findOne({
    where: {
      id: parseInt(req.params.id),
    },
  })
    .then((petition) => {
      if (petition)
        petition
          .update(req.body)
          .then((petition) => {
            res.status(202).send(petition);
          })
          .catch((err) => {
            res.status(304).send(petition);
            console.log("Error updating petition:" + err);
          });
      else res.status(404).send({ message: "petition not found." });
    })
    .catch((err) => {
      res.status(500).send({ code: err.code, message: "Error fetching petition." });
      console.log("An error ocurred fetching a petition:", err);
    });
};

// DELETE

exports.delete_petition = function (req, res) {
  return models.Petition.findOne({
    where: {
      id: parseInt(req.params.id),
    },
  })
    .then((petition) => {
      petition
        .destroy()
        .then(() => {
          res.status(200).send({ message: "Petition removed." });
        })
        .catch((err) => {
          res.status(304).send(petition);
          console.log("Error deleting petition:" + err);
        });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error: Could not remove petition." });
      console.log("Error deleting petition:" + err);
    });
};
