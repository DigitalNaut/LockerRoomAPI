const models = require("../models");

// CREATE

exports.new_message = async function (req, res) {
  try {
    let sender = await models.User.findOne({
      where: {
        id: req.body.senderId,
      },
    });

    if (!sender) {
      console.log("Bad request: creating a message valid sender user");
      return res
        .status(400)
        .send({ message: "The message requires an existing sender user" });
    }

    let recipient = await models.User.findOne({
      where: {
        id: req.body.recipientId,
      },
    });

    if (!recipient) {
      console.log("Bad request: creating a message valid recipient user");
      return res
        .status(400)
        .send({ message: "The message requires an existing recipient user" });
    }

    let message = models.Message.build({
      senderId: req.body.senderId,
      recipientId: req.body.recipientId,
      subject: req.body.subject,
      body: req.body.body,
      footer: req.body.footer,
    });

    if (message) {
      return message
        .save()
        .then((message) => res.status(201).send(message))
        .catch((error) => {
          console.log("Error saving message to database:", error.message);
          return res
            .status(420)
            .send({ message: "Could not save new message to database." });
        });
    } else {
      console.log("Built message is null!");
      return res.status(503).send({ message: "Failed to build new message." });
    }
  } catch (error) {
    console.log("Error: Could not create message.");
    return res.status(503).send({ message: "Could not create new message." });
  }
};

// READ

exports.get_all_messages = async function (req, res) {
  try {
    let messages = await models.Message.findAll();
    if (messages.length) return res.status(200).send(messages);
    else return res.status(501).send({ message: "No messages found" });
  } catch (error) {
    console.log("Error fetching messages:", error);
    return res.status(500).send({ message: "Failed to fetch messages." });
  }
};

exports.get_user_messages = async function (req, res) {
  try {
    let message = await models.Message.findAll({
      where: {
        senderId: parseInt(req.params.id),
      },
    });

    if (message) return res.status(200).send(message);
    else return res.status(404).send({ message: "User's message not found" });
  } catch (error) {
    console.log("Error fetching message: " + error);
    return res
      .status(500)
      .send({ message: "Error fetching a user's messages" });
  }
};

exports.get_message = async function (req, res) {
  try {
    let message = await models.Message.findAll({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (message) return res.status(200).send(message);
    else return res.status(404).send({ message: "Message not found" });
  } catch (error) {
    console.log("Error fetching message: " + error);
    return res.status(500).send({ message: "Error fetching a messages" });
  }
};

// UPDATE

exports.edit_message = async function (req, res) {
  try {
    let message = await models.Message.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (message)
      return message
        .update(req.body)
        .then((message) => {
          res.status(202).send(message);
        })
        .catch((error) => {
          res.status(304).send(message);
          console.log("Error updating message:" + error);
        });
    else return res.status(404).send({ message: "message not found." });
  } catch (error) {
    console.log("An error ocurred fetching a message:", error);
    return res
      .status(500)
      .send({ code: error.code, message: "Error fetching message." });
  }
};

// DELETE

exports.delete_message = async function (req, res) {
  try {
    let message = await models.Message.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return message
      .destroy()
      .then(() => {
        return res.status(200).send({ message: "Message removed." });
      })
      .catch((error) => {
        console.log("Error deleting message:" + error);
        return res.status(304).send(message);
      });
  } catch (error) {
    console.log("Error deleting message:" + error);
    return res
      .status(500)
      .send({ message: "Error: Could not remove message." });
  }
};
