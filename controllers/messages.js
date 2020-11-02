const models = require("../models");

// CREATE

exports.new_message = async function (req, res) {
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
};

// READ

exports.get_all_messages = function (req, res) {
  return models.Message.findAll()
    .then((messages) => {
      if (messages.length) res.status(200).send(messages);
      else res.status(501).send({ message: "No messages found" });
    })
    .catch((err) => {
      res.status(500).send({ message: "Failed to fetch messages." });
      console.log("Error fetching messages:", err);
    });
};

exports.get_user_messages = function (req, res) {
  return models.Message.findAll({
    where: {
      senderId: parseInt(req.params.id),
    },
  })
    .then((message) => {
      if (message) res.status(200).send(message);
      else res.status(404).send({ message: "User's message not found" });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error fetching a user's messages" });
      console.log("Error fetching message: " + err);
    });
};

exports.get_message = function (req, res) {
  return models.Message.findAll({
    where: {
      id: parseInt(req.params.id),
    },
  })
    .then((message) => {
      if (message) res.status(200).send(message);
      else res.status(404).send({ message: "Message not found" });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error fetching a messages" });
      console.log("Error fetching message: " + err);
    });
};

// UPDATE

exports.edit_message = function (req, res) {
  return models.Message.findOne({
    where: {
      id: parseInt(req.params.id),
    },
  })
    .then((message) => {
      if (message)
        message
          .update(req.body)
          .then((message) => {
            res.status(202).send(message);
          })
          .catch((err) => {
            res.status(304).send(message);
            console.log("Error updating message:" + err);
          });
      else res.status(404).send({ message: "message not found." });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ code: err.code, message: "Error fetching message." });
      console.log("An error ocurred fetching a message:", err);
    });
};

// DELETE

exports.delete_message = function (req, res) {
  return models.Message.findOne({
    where: {
      id: parseInt(req.params.id),
    },
  })
    .then((message) => {
      message
        .destroy()
        .then(() => {
          res.status(200).send({ message: "Message removed." });
        })
        .catch((err) => {
          res.status(304).send(message);
          console.log("Error deleting message:" + err);
        });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error: Could not remove message." });
      console.log("Error deleting message:" + err);
    });
};
