const models = require("../models");

function isValidDate(value) {
  let date = new Date(value);
  return (
    date &&
    Object.prototype.toString.call(date) === "[object Date]" &&
    !isNaN(date)
  );
}

// CREATE
// get_public_events;
// get_events_by_user;
// get_event;
// edit_event;
// delete_event;

exports.new_event = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    if (role !== "admin") return res.status();

    let {
      body,
      body: {
        title,
        type,
        code,
        expDate,
        userFilter,
        mandatory,
        template,
        about,
      },
    } = req;

    let validDate = isValidDate(expDate);
    if (!validDate && expDate !== undefined)
      return res.status(400).json({ message: "Error: Date provided is not valid." });

    mandatory = mandatory ? true : false;

    try {
      [about, template, userFilter] = [about, template, userFilter].map(
        (item) => {
          item.replace(/\s/g, "");
          if (item !== "") return JSON.parse(item);
        }
      );
    } catch (error) {
      console.log("Error creating event:", error);
      return res.status(400).json({ message: "Error: Input is not valid." });
    }

    let [newEvent, created] = await models.Event.findCreateFind({
      where: {
        creator: username,
        title,
        type,
        code,
      },
      default: {
        creator: username,
        title,
        about,
        type,
        code,
        userFilter,
        mandatory,
        expDate,
        expDate,
        template,
      },
    });

    if (!created)
      return res.status(400).json({ message: "Error: Event already exists." });

    newEvent.about = about;
    newEvent.userFilter = userFilter;
    newEvent.expDate = expDate;
    newEvent.template = template;
    newEvent.mandatory = mandatory;
    await newEvent.save();

    return res.status(201).send(newEvent);
  } catch (error) {
    console.log("Error fetching event:", error);
    return (
      (res &&
        res
          .status(500)
          .json({ message: "Internal Error: Failed to fetch event." })) ||
      null
    );
  }
};

// READ

const count = async (type) =>
  await models.Event.count({
    where: { type, code: "*" },
    distinct: true,
    col: "Event.code",
  }).then((count) => count);

exports.get_all_events = async function (req, res) {
  try {
    let { headers: role } = req;

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

async function getEventsByType(type, res) {
  try {
    let events = await models.Event.findAll({
      where: {
        type,
      },
    });

    events = events.forEach((event) =>
      event.purge(role, event.sender === username)
    );

    if (events.length) return res.status(200).send(events);
    else
      return res
        .status(501)
        .json({ message: `No ${type} events found for ${username}.` });
  } catch (error) {
    console.log(`Error fetching ${type} events:`, error);
    return res
      .status(500)
      .json({ message: `Internal Error: Fetching ${type} events failed.` });
  }
}

exports.get_user_events = async function (req, res) {
  return getEventsByType("user", res);
};

exports.get_public_events = async function (req, res) {
  return getEventsByType("public", res);
};

exports.get_event = async function (req, res) {
  try {
    let {
      headers: { role },
    } = req;
    let {
      body: { title, code },
    } = req;

    let event = await models.Event.findOne({
      where: {
        title: title,
        code: code,
      },
    });

    if (!event)
      return res.status(404).json({ message: "Error: Event not found." });

    if (!event.userFilter.contains(role))
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
        .json({ message: "Error: Event not found to edit." });

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
        .json({ message: "Error: Event to delete not found." });

    if (event.sender !== user)
      return res.status(400).send({
        message:
          "Authentication Error: You do not have permission to delete this event.",
      });

    await event.destroy();

    return res.status(200).json({ message: "Event removed." });
  } catch (error) {
    console.log("Error deleting event:" + error);
    return res.status(500).json({ message: "Error: Could not remove event." });
  }
};
