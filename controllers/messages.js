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
      if (messages.length) return res.status(200).send(messages);
      else return res.status(501).send({ message: "No messages found" });
    })
    .catch((err) => {
      console.log("Error fetching messages:", err);
      return res.status(500).send({ message: "Failed to fetch messages." });
    });
};

exports.get_user_messages = function (req, res) {
  return models.Message.findAll({
    where: {
      senderId: parseInt(req.params.id),
    },
  })
    .then((message) => {
      if (message) return res.status(200).send(message);
      else return res.status(404).send({ message: "User's message not found" });
    })
    .catch((err) => {
      console.log("Error fetching message: " + err);
      return res.status(500).send({ message: "Error fetching a user's messages" });
    });
};

exports.get_message = function (req, res) {
  return models.Message.findAll({
    where: {
      id: parseInt(req.params.id),
    },
  })
    .then((message) => {
      if (message) return res.status(200).send(message);
      else return res.status(404).send({ message: "Message not found" });
    })
    .catch((err) => {
      console.log("Error fetching message: " + err);
      return res.status(500).send({ message: "Error fetching a messages" });
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
        return message
          .update(req.body)
          .then((message) => {
            res.status(202).send(message);
          })
          .catch((err) => {
            res.status(304).send(message);
            console.log("Error updating message:" + err);
          });
      else return res.status(404).send({ message: "message not found." });
    })
    .catch((err) => {
      console.log("An error ocurred fetching a message:", err);
      return res
        .status(500)
        .send({ code: err.code, message: "Error fetching message." });
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
      return message
        .destroy()
        .then(() => {
          return res.status(200).send({ message: "Message removed." });
        })
        .catch((err) => {
          console.log("Error deleting message:" + err);
          return res.status(304).send(message);
        });
    })
    .catch((err) => {
      console.log("Error deleting message:" + err);
      return res.status(500).send({ message: "Error: Could not remove message." });
    });
};
