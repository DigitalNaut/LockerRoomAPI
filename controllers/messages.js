const models = require("../models");

// CREATE

exports.new_message = async function (req, res) {
  try {
    let sender = req.headers.username;
    let role = req.headers.role;

    let recipient = await models.User.findOne({
      where: {
        username: req.body.recipient,
      },
    });

    if (!recipient) {
      console.log("Bad request: Could not determine a valid recipient user.");
      return res.status(400).send({
        message:
          "The message needs a valid recipient.",
      });
    }

    let message = models.Message.build({
      sender: sender,
      recipient: recipient.username,
      subject: req.body.subject,
      body: req.body.body,
      footer: req.body.footer,
    });

    if (!message) {
      //console.log("Building a message returned a null object: ", message);
      return res
        .status(503)
        .send({ message: "Internal Error: Failed to build new message." });
    }

    await message.save();

    message = message.purge(role, message.sender === sender);

    return res.status(201).send(message);
  } catch (error) {
    console.log("Error: Could not create message: " + error);
    return res.status(503).send({ message: "Could not create new message." });
  }
};

// READ

exports.get_all_messages = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    let messages = await models.Message.findAll();

    if (!messages.length)
      return res.status(501).send({ message: "No messages found." });

    messages = messages.map((message) =>
      message.purge(
        role,
        message.sender === username || message.recipient === username
      )
    );

    return res.status(200).send(messages);
  } catch (error) {
    console.log("Error fetching all messages:", error);
    return res
      .status(500)
      .send({ message: "Internal Error: Failed to fetch all messages." });
  }
};

exports.get_user_messages = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    let sentMessages = await models.Message.findAll({
      where: {
        sender: username,
      },
    });
    let receivedMessages = await models.Message.findAll({
      where: {
        recipient: username,
      },
    });
    let messages = sentMessages.concat(
      ...receivedMessages.filter((recMsgs) => !sentMessages.includes(recMsgs))
    );

    if (!messages.length)
      return res
        .status(501)
        .send({ message: `No messages found for ${username}.` });

    messages = messages.map((message) =>
      message.purge(
        role,
        message.sender === username || message.recipient === username
      )
    );

    return res.status(200).send(messages);
  } catch (error) {
    console.log("Error fetching user message: " + error);
    return res
      .status(500)
      .send({ message: "Internal Error: Error fetching messages" });
  }
};

exports.get_sent_messages = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    let messages = await models.Message.findAll({
      where: {
        sender: username,
      },
    });

    if (!messages.length)
      return res
        .status(501)
        .send({ message: `No messages found sent by ${username}.` });

    messages = messages.map((message) =>
      message.purge(role, message.sender === username)
    );

    return res.status(200).send(messages);
  } catch (error) {
    console.log("Error fetching sent message: " + error);
    return res
      .status(500)
      .send({ message: "Internal Error: While fetching sent messages" });
  }
};

exports.get_received_messages = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    let messages = await models.Message.findAll({
      where: {
        recipient: username,
      },
    });

    if (!messages.length)
      return res
        .status(501)
        .send({ message: `No messages found for ${username} as recipient.` });

    messages = messages.map((message) =>
      message.purge(role, message.recipient === username)
    );

    return res.status(200).send(messages);
  } catch (error) {
    console.log("Error fetching received message: " + error);
    return res
      .status(500)
      .send({ message: "Internal Error: While fetching received messages." });
  }
};

exports.get_message = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    let message = await models.Message.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!message)
      return res.status(404).send({ message: "Error: Message not found." });

    if (
      message.dataValues.sender !== username &&
      message.dataValues.recipient !== username
    ) {
      return res.status(403).send({
        message: "Forbidden: You do not have permission to view the message.",
      });
    }
    message = message.purge(
      role,
      message.sender === username || message.recipient === username
    );

    return res.status(200).send(message);
  } catch (error) {
    console.log("Error fetching a message: " + error);
    return res
      .status(500)
      .send({ message: "Internal Error: Error fetching a message" });
  }
};

// UPDATE

exports.edit_message = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    let message = await models.Message.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!message)
      return res
        .status(404)
        .send({ message: "Error: Message not found to edit." });

    if (username !== message.dataValues.sender)
      return res.status(403).send({
        message: "Forbidden: You do not have permission to edit the message.",
      });

    let newProperties = {};

    if (req.body.subject) newProperties.subject = req.body.subject;
    if (req.body.body) newProperties.body = req.body.body;

    await message.update(newProperties);

    message = message.purge(role, message.sender === username);

    return res.status(200).send(message);
  } catch (error) {
    console.log("Error: Could not edit a message: ", error);
    return res
      .status(500)
      .send({ message: "Internal Error: Fetching the message failed." });
  }
};

// DELETE

exports.delete_message = async function (req, res) {
  try {
    let username = req.headers.username;

    let message = await models.Message.findOne({
      where: {
        id: parseInt(req.params.id),
        sender: username,
      },
    });

    if (!message)
      return res
        .status(400)
        .json({ message: "Error: No message found to delete." });

    if (username !== message.dataValues.sender)
      return res.status(403).send({
        message: "Forbidden: You do not have permission to delete the message.",
      });

    await message.destroy();

    return res.status(200).json({ message: "OK: Message removed." });
  } catch (error) {
    console.log("Error deleting message:" + error);
    return res
      .status(500)
      .send({ message: "Internal Error: Could not remove message." });
  }
};
