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
    await petition.save();
    return res.status(201).send(petition);
  } else {
    console.log("Error saving petition to database:", error.message);
    return res
      .status(420)
      .send({ message: "Could not save new petition to database." });
  }
};

// READ

exports.get_all_petitions = async function (req, res) {
  try {
    let petititons = await models.Petition.findAll();
    if (petitions.length) return res.status(200).send(petitions);
    else return res.status(501).send({ message: "No petitions found" });
  } catch (error) {
    console.log("Error fetching petitions:", error);
    return res.status(500).send({ message: "Failed to fetch petitions." });
  }
};

exports.get_petition = async function (req, res) {
  try {
    let petition = awaitmodels.Petition.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (petition) return res.status(200).send(petition);
    else return res.status(404).send({ message: "Petition not found" });
  } catch (error) {
    console.log("Error fetching petition: " + error);
    return res.status(500).send({ message: "Error fetching petition" });
  }
};

// UPDATE

exports.edit_petition = async function (req, res) {
  try {
    let petition = await models.Petition.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (petition) {
      await petition.update(req.body);
      return res.status(202).send(petition);
    } else return res.status(404).send({ message: "petition not found." });
  } catch (error) {
    console.log("An error ocurred fetching a petition:", error);
    return res
      .status(500)
      .send({ code: error.code, message: "Error fetching petition." });
  }
};

// DELETE

exports.delete_petition = async function (req, res) {
  try {
    let petition = await models.Petition.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });
    await petition.destroy();
    return res.status(200).send({ message: "Petition removed." });
  } catch (error) {
    console.log("Error deleting petition:" + error);
    return res
      .status(500)
      .send({ message: "Error: Could not remove petition." });
  }
};
