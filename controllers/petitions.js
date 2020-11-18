const models = require("../models");

// CREATE

exports.new_petition = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    let petition = await models.Petition.findOne({
      where: {
        sender: username,
        type: req.body.type,
        code: req.body.code,
      },
    });

    if (petition)
      return res
        .status(400)
        .send({ message: "Error: Petition already exists." });

    petition = await models.Petition.build({
      sender: username,
      type: req.body.type,
      code: req.body.code,
      enclosure: req.body.enclosure,
      result: "pending",
    });

    await petition.save();

    petition = petition.purge(role, petition.sender === username);

    return res.status(201).send(petition);
  } catch (error) {
    console.log("Error fetching petition:", error);
    return (
      (res &&
        res
          .status(500)
          .send({ message: "Internal Error: Failed to fetch petition." })) ||
      null
    );
  }
};

// READ

exports.get_all_petitions = async function (req, res) {
  try {
    let role = req.headers.role;

    let petitions = await models.Petition.findAll();

    if (!petitions.length)
      return res.status(501).send({ message: "No petitions found." });

    petitions = petitions.forEach((petition) =>
      petition.purge(role, petition.sender === username)
    );

    return res.status(200).send(petitions);
  } catch (error) {
    console.log("Error fetching petitions:", error);
    return res.status(500).send({ message: "Failed to fetch petitions." });
  }
};

exports.get_user_petitions = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    let petitions = await models.Petition.findAll();
    petitions = petitions.filter((petition) => petition.sender === username);

    petition = petitions.forEach((petition) =>
      petition.purge(role, petition.sender === username)
    );

    if (petitions.length) return res.status(200).send(petitions);
    else
      return res
        .status(501)
        .send({ message: `No petitions found for ${username}.` });
  } catch (error) {
    console.log("Error fetching petitions:", error);
    return res
      .status(500)
      .send({ message: "Internal Error: Fetching user petitions failed." });
  }
};

exports.get_petition = async function (req, res) {
  try {
    let user = req.headers.username;
    let role = req.headers.role;

    let petition = await models.Petition.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!petition)
      return res.status(404).send({ message: "Error: Petition not found." });

    if (!(petition === sender, user))
      return res.status(404).send({
        message:
          "Authentication Error: You do not have permissoin to see this petition.",
      });

    petition = petition.purge(role, petition.sender === username);

    return res.status(200).send(petition);
  } catch (error) {
    console.log("Error fetching petition: " + error);
    return res.status(500).send({ message: "Error: Could not fetch petition" });
  }
};

// UPDATE

exports.edit_petition = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    console.log("Sender is: " + username);

    let petition = await models.Petition.findOne({
      where: {
        sender: username,
        code: req.params.code,
      },
    });

    if (!petition)
      return res
        .status(404)
        .send({ message: "Error: Petition not found to edit." });

    if (petition.sender !== username)
      return res.status(404).send({
        message:
          "Authentication Error: You do not have permission to edit this petition.",
      });

    let newProperties = {};
    if (req.body.enclosure) newProperties.enclosure = req.body.enclosure;

    await petition.update(newProperties);

    petition = petition.purge(role, petition.sender === username);

    return res.status(202).send(petition);
  } catch (error) {
    console.log("An error ocurred fetching a petition:", error);
    return res.status(500).send({
      code: error.code,
      message: "Internal Error: Fetching petition failed.",
    });
  }
};

// DELETE

exports.delete_petition = async function (req, res) {
  try {
    let user = req.headers.username;

    let petition = await models.Petition.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!petition)
      return res
        .status(404)
        .send({ message: "Error: Petition to delete not found." });

    if (petition.sender !== user)
      return res.status(400).send({
        message:
          "Authentication Error: You do not have permission to delete this petition.",
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
