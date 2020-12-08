const models = require("../models");

function isValidDate(value) {
  let date = new Date(value);
  return (
    date &&
    Object.prototype.toString.call(date) === "[object Date]" &&
    !isNaN(date)
  );
}

exports.new_event = async function (req, res) {
  try {
    let { username } = req.headers;
    let { role } = req.headers;

    if (role !== "admin") return res.status();

    let {
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
      return res
        .status(400)
        .json({ message: "Error: Date provided is not valid." });

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
        code: parseInt(code),
      },
      default: {
        creator: username,
        title,
        about,
        type,
        code: parseInt(code),
        userFilter,
        mandatory: Boolean(mandatory),
        expDate: new Date(expDate),
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

    newEvent = newEvent.purge(role, true);

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
    where: { type },
    distinct: true,
    col: "Event.code",
  }).then((count) => count);

exports.get_all_events = async function (req, res) {
  try {
    let { role, username } = req.headers;

    let events = await models.Event.findAll();

    if (!events.length)
      return res.status(404).json({ message: "No events found." });

    events = events.map((event) =>
      event.purge(role, event.creator === username)
    );

    if (!events || !events.length)
      return res.status(401).json({ message: "No events available." });

    return res.status(200).send(events);
  } catch (error) {
    console.log("Error fetching all events:", error);
    return res.status(500).json({ message: "Failed to fetch all events." });
  }
};

exports.get_events_by_type = async function (req, res) {
  try {
    let { type, role } = req.params;
    let events = await models.Event.findAll({
      where: {
        type,
      },
    });

    events = events.map((event) => event.purge(role, true));

    if (events.length) return res.status(200).send(events);
    else
      return res
        .status(404)
        .json({ message: `No events of type '${type}' found.` });
  } catch (error) {
    console.log(`Error fetching events by type:`, error);
    return res
      .status(500)
      .json({ message: `Internal Error: Fetching events by type failed.` });
  }
};

exports.get_events_by_title = async function (req, res) {
  try {
    let { title } = req.params;
    let { role } = req.headers;

    if (!title)
      return res
        .status(400)
        .json({ message: `Invalid title for query '${title}'.` });

    let events = await models.Event.findAll({
      where: {
        title,
      },
    });

    events = events.map((event) => event.purge(role, true));

    if (events.length) return res.status(200).send(events);
    else
      return res
        .status(404)
        .json({ message: `No events found titled '${title}'` });
  } catch (error) {
    console.log(`Error fetching events by title:`, error);
    return res
      .status(500)
      .json({ message: `Internal Error: Fetching events by title failed.` });
  }
};

exports.get_events_by_mandatory = async function (req, res) {
  try {
    let { role } = req.headers;
    let { mandatory, type } = req.params;

    let errMsg;
    if (!mandatory) errMsg = "A value for the query 'mandatory' is required";
    if (!type)
      errMsg = "A type of event for querying by 'mandatory' is required";
    if (errMsg) return res.status(404).json({ message: `${errMsg}` });

    let events = await models.Event.findAll({
      where: {
        mandatory: Boolean(mandatory),
        type,
      },
    });

    events = events.map((event) => event.purge(role, true));

    if (events.length) return res.status(200).send(events);
    else
      return res.status(404).json({
        message: `No mandatory events found.`,
      });
  } catch (error) {
    console.log(`Error fetching events by mandatory field:`, error);
    return res.status(500).json({
      message: `Internal Error: Fetching events by mandatory has failed.`,
    });
  }
};

exports.get_event = async function (req, res) {
  try {
    let { role } = req.headers;
    let { title, code } = req.params;

    let errMsg;
    if (!title) errMsg = "A title is required for fetching an event";
    if (!code)
      errMsg = "A code for the event is required for fetching an event";
    if (errMsg) return res.status(404).json({ message: `${errMsg}` });

    let event = await models.Event.findOne({
      where: {
        title,
        code: parseInt(code),
      },
    });

    if (!event)
      return res.status(404).json({ message: "Error: Event not found." });

    event = event.purge(role, true);

    return res.status(200).send(event);
  } catch (error) {
    console.log("Error fetching event: " + error);
    return res.status(500).json({ message: "Error: Could not fetch event" });
  }
};

exports.get_events_by_creator = async function (req, res) {
  try {
    let { creator } = req.params;
    let { role } = req.headers;

    let events = await models.Event.findAll({
      where: {
        creator,
      },
    });

    events = events.map((event) => event.purge(role, true));

    if (events.length) return res.status(200).send(events);
    else
      return res.status(404).json({
        message: `No events found by ${creator}.`,
      });
  } catch (error) {
    console.log(`Error fetching events by creator:`, error);
    return res.status(500).json({
      message: `Internal Error: Fetching events by creator has failed.`,
    });
  }
};

// UPDATE

exports.edit_event = async function (req, res) {
  try {
    let { username, role } = req.headers;
    let { title: eventTitle, code: eventCode } = req.params;

    let {
      title,
      about,
      type,
      code,
      userFilter,
      mandatory,
      expDate,
      template,
    } = req.body;

    let errMsg;
    if (!eventTitle) errMsg = "A title is required for editing an event";
    if (isNaN(eventCode))
      errMsg = "A code for the event is required for editing an event";
    if (errMsg) return res.status(404).json({ message: `${errMsg}` });

    let event = await models.Event.findOne({
      where: {
        title: eventTitle,
        code: eventCode,
      },
    });

    if (!event)
      return res.status(404).json({
        message: `Error: Event titled '${eventTitle}' code ${eventCode} not found to edit.`,
      });

    if (event.creator !== username)
      return res.status(404).send({
        message:
          "Permissions Error: You do not have permission to edit this event because you did not create it.",
      });

    let newProperties = {
      title: title ? title : event.title,
      about: about ? about : event.about,
      type: type ? type : event.about,
      code: !isNaN(code) ? parseInt(code) : event.code,
      userFilter: userFilter ? userFilter : event.userFilter,
      mandatory: Boolean(mandatory),
      expDate: expDate ? new Date(expDate) : event.expDate,
      template: template ? template : event.template,
    };

    await event.update(newProperties);

    event = event.purge(role, true);

    return res.status(202).send(event);
  } catch (error) {
    console.log("Error updating an event:", error);
    return res.status(500).send({
      code: error.code,
      message: "Internal Error: Updating event failed.",
    });
  }
};

// DELETE

exports.delete_event = async function (req, res) {
  try {
    let { username } = req.headers;
    let { title, code } = req.params;

    let errMsg;
    if (!title) errMsg = "A title is required for deleting an event";
    if (isNaN(code))
      errMsg = "A code for the event is required for deleting an event";
    if (errMsg) return res.status(404).json({ message: `${errMsg}` });

    let event = await models.Event.findOne({
      where: {
        title,
        code: parseInt(code),
      },
    });

    if (!event)
      return res
        .status(404)
        .json({ message: "Error: Event to delete not found." });

    if (event.creator !== username)
      return res.status(401).send({
        message:
          "Authentication Error: You do not have permission to delete this event.",
      });

    await event.destroy();

    return res.status(200).json({ message: "Event removed successfully." });
  } catch (error) {
    console.log("Error deleting event:" + error);
    return res.status(500).json({ message: "Error: Could not remove event." });
  }
};
