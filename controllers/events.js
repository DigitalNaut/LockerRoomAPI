const models = require("../models");

// CREATE

exports.new_event = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    let [newEvent, created] = await models.Event.findCreateFind({
      where: {
        sender: username,
        type: req.body.type,
        code: req.body.code,
      },
      default: { sender: username, type: req.body.type, code: req.body.code },
    });

    if (!created)
      return res.status(400).send({ message: "Error: Event already exists." });

    return res.status(201).send(newEvent);
  } catch (error) {
    console.log("Error fetching event:", error);
    return (
      (res &&
        res
          .status(500)
          .send({ message: "Internal Error: Failed to fetch event." })) ||
      null
    );
  }
};

// READ

const count = await models.Event.count({
  where: { code: "*" },
  distinct: true,
  col: "Product.id",
}).then((count) => count);

exports.get_all_events = async function (req, res) {
  try {
    let role = req.headers.role;

    let events = await models.Event.findAll();

    if (!events.length)
      return res.status(501).json({ message: "No events found." });

    events = events.forEach((event) =>
      event.purge(role, event.sender === username)
    );

    return res.status(200).send(events);
  } catch (error) {
    console.log("Error fetching events:", error);
    return res.status(500).json({ message: "Failed to fetch events." });
  }
};

exports.get_user_events = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    let events = await models.Event.findAll();
    events = events.filter((event) => event.sender === username);

    events = events.forEach((event) =>
      event.purge(role, event.sender === username)
    );

    if (events.length) return res.status(200).send(events);
    else
      return res
        .status(501)
        .send({ message: `No events found for ${username}.` });
  } catch (error) {
    console.log("Error fetching events:", error);
    return res
      .status(500)
      .send({ message: "Internal Error: Fetching user events failed." });
  }
};

exports.get_event = async function (req, res) {
  try {
    let user = req.headers.username;
    let role = req.headers.role;

    let event = await models.Event.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!event)
      return res.status(404).json({ message: "Error: Event not found." });

    if (!(event === sender, user))
      return res.status(404).send({
        message:
          "Authentication Error: You do not have permissoin to see this event.",
      });

    event = event.purge(role, event.sender === username);

    return res.status(200).send(event);
  } catch (error) {
    console.log("Error fetching event: " + error);
    return res.status(500).json({ message: "Error: Could not fetch event" });
  }
};

// UPDATE

exports.edit_event = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    console.log("Sender is: " + username);

    let event = await models.Event.findOne({
      where: {
        sender: username,
        code: req.params.code,
      },
    });

    if (!event)
      return res
        .status(404)
        .send({ message: "Error: Event not found to edit." });

    if (event.sender !== username)
      return res.status(404).send({
        message:
          "Authentication Error: You do not have permission to edit this event.",
      });

    let newProperties = {};
    if (req.body.enclosure) newProperties.enclosure = req.body.enclosure;

    await event.update(newProperties);

    event = event.purge(role, event.sender === username);

    return res.status(202).send(event);
  } catch (error) {
    console.log("An error ocurred fetching a event:", error);
    return res.status(500).send({
      code: error.code,
      message: "Internal Error: Fetching event failed.",
    });
  }
};

// DELETE

exports.delete_delete = async function (req, res) {
  try {
    let user = req.headers.username;

    let event = await models.Event.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!event)
      return res
        .status(404)
        .send({ message: "Error: Event to delete not found." });

    if (event.sender !== user)
      return res.status(400).send({
        message:
          "Authentication Error: You do not have permission to delete this event.",
      });

    await event.destroy();

    return res.status(200).json({ message: "Event removed." });
  } catch (error) {
    console.log("Error deleting event:" + error);
    return res.status(500).send({ message: "Error: Could not remove event." });
  }
};
