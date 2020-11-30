const models = require("../models");

// CREATE

let create_lockers = async function (number) {
  let lockers = [];

  for (let index = 0; index < number; index++) {
    let locker = models.Locker.build({
      user: null,
    });
    await locker.save();

    lockers.push(locker);
  }

  return lockers;
};

let delete_lockers = function (lockers) {
  return lockers.forEach(async (locker) => {
    await locker.destroy();
  });
};

exports.flush_lockers = async function (req, res) {
  try {
    let username = req.headers.username;

    if (isNaN(req.params.number) || req.params.number < 1)
      return res.status(400).json({ message: "Error: Bad request." });

    let lockers = await models.Locker.findAll();

    if (lockers.length) await delete_lockers(lockers);

    await create_lockers(req.params.number);

    lockers = await models.Locker.findAll();

    lockers = lockers.map((locker) => {
      locker = locker.purge(role, locker.dataValues.user === username);
      return locker;
    });

    return res.status(201).send(lockers);
  } catch (error) {
    console.log("Error fetching lockers:", error);
    return res.status(500).json({ message: "Failed to fetch lockers." });
  }
};

// READ

exports.list_lockers = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    let lockers = await models.Locker.findAll();

    if (!lockers.length)
      return res.status(501).json({ message: "No lockers found." });

    lockers = lockers.map((locker) => {
      locker = locker.purge(role, locker.dataValues.user === username);
      locker.isOccupied = locker.user ? true : false;
      return locker;
    });

    return res.status(200).send(lockers);
  } catch (error) {
    console.log("Error fetching lockers:", error);
    return res.status(500).json({ message: "Failed to fetch lockers." });
  }
};

exports.show_user_lockers = async function (req, res) {
  try {
    let user = req.headers.username;
    let role = req.headers.role;

    let lockers = await models.Locker.findAll({
      where: {
        user: user,
      },
    });

    if (!lockers.length)
      return res.status(501).json({ message: `No lockers found for ${user}.` });

    lockers = lockers.map((locker) => locker.purge(role));

    return res.status(200).send(lockers);
  } catch (error) {
    console.log("Error fetching lockers:", error);
    return res
      .status(500)
      .json({ message: "Internal Error: Fetching user lockers failed." });
  }
};

exports.show_locker = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    if (isNaN(req.params.id))
      return res.status(403).send({
        message: "Invalid Request: The locker id is not a number.",
      });

    let locker = await models.Locker.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!locker)
      return res.status(404).json({ message: "Error: Locker not found." });

    locker = locker.purge(role, locker.dataValues.user === username);

    return res.status(200).send(locker);
  } catch (error) {
    console.log("Error fetching locker: " + error);
    return res.status(500).json({ message: "Error: Could not fetch locker" });
  }
};

// UPDATE

exports.claim_locker = async function (req, res) {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    if (isNaN(req.params.id))
      return res.status(403).send({
        message: "Invalid Request: The locker id is not a number.",
      });

    let locker = await models.Locker.findOne({
      where: {
        id: req.params.id,
      },
    });

    let user = await models.User.findOne({
      where: {
        username: username,
      },
    });

    if (!locker)
      return res
        .status(404)
        .json({ message: "Error: Locker not found to claim." });

    if (locker.dataValues.user)
      if (locker.dataValues.user === username)
        return res.status(200).send({
          message: "Redundant: You already own this locker.",
        });
      else
        return res.status(404).send({
          message:
            "Authentication Error: You do not have permission to claim this locker.",
        });

    await locker.update({ user: username });
    await user.update({ locker: locker });

    locker = locker.purge(role, locker.dataValues.user === username);

    return res.status(202).send(locker);
  } catch (error) {
    console.log("An error ocurred fetching a locker:", error);
    return res.status(500).send({
      code: error.code,
      message: "Internal Error: Fetching locker failed.",
    });
  }
};

// DELETE

exports.purge_lockers = async function (req, res) {
  try {
    let lockers = await models.Locker.findAll();

    delete_lockers(lockers);

    return res.status(200).json({ message: "Lockers deleted." });
  } catch (error) {
    console.log("Error deleting lockers:" + error);
    return res
      .status(500)
      .json({ message: "Error: Could not remove lockers." });
  }
};

exports.release_locker = async function (req, res) {
  try {
    let username = req.headers.username;

    if (isNaN(req.params.id))
      return res.status(403).send({
        message: "Invalid Request: The locker id is not a number.",
      });

    let locker = await models.Locker.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!locker)
      return res
        .status(404)
        .json({ message: "Error: Locker to release not found." });

    if ((locker !== user, username))
      return res.status(400).send({
        message: "Authentication Error: You have not claimed this locker.",
      });

    let user = await models.User.findOne({
      where: {
        username: username,
      },
    });

    await locker.update({ user: null });
    await user.update({ locker: null });

    return res.status(200).json({ message: "Locker released." });
  } catch (error) {
    console.log("Error deleting locker:" + error);
    return res
      .status(500)
      .json({ message: "Error: Could not release locker." });
  }
};
