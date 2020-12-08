const models = require("../models");

// CREATE

exports.new_petition = async function (req, res) {
  try {
    let { username, role } = req.headers;
    let { event, enclosure } = req.body;

    let errMsg;
    if (isNaN(event))
      errMsg = "A valid event is required to submit this petition.";
    if (!enclosure)
      errMsg = "An enclosure is required to submit this petition.";
    if (errMsg) res.status(401).send({ message: errMsg });

    let lookupEvent = await models.Event.findOne({
      where: {
        id: event,
      },
    });

    if (!lookupEvent)
      res
        .status(401)
        .send({ message: "The target event of the petition does not exist." });

    let { newPetition, created } = await models.Petition.findCreateFind({
      where: {
        sender: username,
        event,
      },
      defaults: {
        sender: username,
        event,
        enclosure,
      },
    });

    if (!created)
      return res
        .status(400)
        .json({ message: "Error: A petition for this event already exists." });

    newPetition = newPetition.purge(role, newPetition.sender === username);

    return res.status(201).send(newPetition);
  } catch (error) {
    console.log("Error fetching petition:", error);
    return (
      (res &&
        res
          .status(500)
          .json({ message: "Internal Error: Failed to fetch petition." })) ||
      null
    );
  }
};

// READ

exports.get_all_petitions = async function (req, res) {
  try {
    let { role } = req.headers;

    let petitions = await models.Petition.findAll();

    if (!petitions.length)
      return res.status(501).json({ message: "No petitions found." });

    petitions = petitions.map((petition) =>
      petition.purge(role, petition.sender === username)
    );

    return res.status(200).send(petitions);
  } catch (error) {
    console.log("Error fetching petitions:", error);
    return res.status(500).json({ message: "Failed to fetch petitions." });
  }
};

exports.get_user_petitions = async function (req, res) {
  try {
    let { username, role } = req.headers;

    let petitions = await models.Petition.findAll({
      where: { sender: username },
    });

    petition = petitions.map((petition) =>
      petition.purge(role, petition.sender === username)
    );

    if (petitions.length) return res.status(200).send(petitions);
    else
      return res
        .status(404)
        .json({ message: `No petitions found for ${username}.` });
  } catch (error) {
    console.log("Error fetching petitions:", error);
    return res
      .status(500)
      .json({ message: "Internal Error: Fetching user petitions failed." });
  }
};

exports.get_petitions_by_event = async function (req, res) {
  try {
    let { username, role } = req.headers;
    let { event } = req.params;

    if (isNaN(event))
      return res
        .status(401)
        .send({ message: "A valid event is required to fetch its petitions." });

    let lookupEvent = await models.Event.findOne({
      where: { id: event },
    });

    if (!lookupEvent)
      return res
        .status(401)
        .send({ message: "The petitions' event doesn't exist." });

    if (lookupEvent.creator !== username)
      return res.status(404).send({
        message:
          "Authentication Error: You do not have permissoin to see these petitions.",
      });

    let petition = await models.Petition.findOne({
      where: {
        event: parseInt(event),
      },
    });

    if (!petition)
      return res.status(404).json({ message: "Error: Petition not found." });

    petition = petition.purge(role, petition.sender === username);

    return res.status(200).send(petition);
  } catch (error) {
    console.log("Error fetching petition: " + error);
    return res.status(500).json({ message: "Error: Could not fetch petition" });
  }
};

exports.get_petition = async function (req, res) {
  try {
    let { username, role } = req.headers;
    let { event, sender } = req.params;

    let errMgs;
    if (isNaN(event))
      errMgs = "A valid event is required to fetch its petitions.";
    if (!sender) errMgs = "A valid sender is required to fetch its petitions.";
    if (errMgs) return res.status(401).send({ message: errMgs });

    let petition = await models.Petition.findOne({
      where: {
        sender,
        event: parseInt(event),
      },
    });

    if (!petition)
      return res.status(404).json({ message: "Error: Petition not found." });

    if (petition.sender !== username && role !== "admin")
      return res.status(404).send({
        message:
          "Authentication Error: You do not have permissoin to view this petition.",
      });

    petition = petition.purge(role, petition.sender === username);

    return res.status(200).send(petition);
  } catch (error) {
    console.log("Error fetching petition: " + error);
    return res
      .status(500)
      .json({ message: "Error: Could not fetch petition." });
  }
};

// UPDATE

exports.edit_petition = async function (req, res) {
  try {
    let { username, role } = req.headers;
    let { event } = req.params;
    let { enclosure } = req.body;

    if (!event)
      return res.status(401).send({
        message: "Error: A valid event is required to update a petition.",
      });

    let petition = await models.Petition.findOne({
      where: {
        sender: username,
        event: parseInt(event),
      },
    });

    if (!petition)
      return res
        .status(404)
        .json({ message: "Error: No peititon found to edit." });

    if (petition.sender !== username && role !== "admin")
      return res.status(404).send({
        message:
          "Authentication Error: You do not have permission to edit this petition.",
      });

    await petition.update(enclosure);
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

exports.resolve_petition = async function (req, res) {
  try {
    let { username, role } = req.headers;
    let { id } = req.params;
    let { result, resultMessage } = req.body;

    let errMsg;
    if (isNaN(id))
      errMsg =
        "Error: A valid petition id is required to respond to a petition.";
    if (!result) errMsg = "A result is required to resolve this petition.";
    if (errMsg)
      return res.status(401).send({
        message: errMsg,
      });

    let petition = await models.Petition.findOne({
      where: {
        id: parseInt(id),
      },
    });

    if (!petition)
      return res
        .status(404)
        .json({ message: "Error: No peititon found to resolve." });

    if (petition.sender !== username && role !== "admin")
      return res.status(404).send({
        message:
          "Authentication Error: You do not have permission to resolve this petition.",
      });

    let newProperties = {
      result,
      resultMessage,
    };
    await petition.update(newProperties);

    petition = petition.purge(
      role,
      petition.sender === username || role === "admin"
    );

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
    let { username, role } = req.headers;
    let { id } = req.params;

    let petition = await models.Petition.findOne({
      where: {
        id: parseInt(id),
      },
    });

    if (isNaN(id))
      return res.status(401).send({
        message: "Error: A valid petition id is required for removal.",
      });

    if (!petition)
      return res
        .status(404)
        .json({ message: "Error: Petition to delete not found." });

    if (petition.sender !== username && role !== "admin")
      return res.status(400).send({
        message:
          "Authentication Error: You do not have permission to delete this petition.",
      });

    await petition.destroy();

    return res.status(200).json({ message: "Petition removed successfully." });
  } catch (error) {
    console.log("Error deleting petition:" + error);
    return res
      .status(500)
      .json({ message: "Error: Could not remove petition." });
  }
};
