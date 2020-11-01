const models = require("../models");

exports.show_lockers = function (req, res) {
  return models.Locker.findAll()
    .then((locker) => {
      if (locker.length) res.status(200).send(locker);
      else res.status(501).send({ message: "No lockers found" });
    })
    .catch((err) => {
      res.status(500).send({ message: "Failed to fetch lockers." });
      console.log("Error fetching lockers:", error.message);
    });
};
