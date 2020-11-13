const models = require("../models");

exports.show_lockers = function (req, res) {
  return models.Locker.findAll()
    .then((locker) => {
      if (locker.length) return res.status(200).send(locker);
      else return res.status(501).send({ message: "No lockers found" });
    })
    .catch((err) => {
      console.log("Error fetching lockers:", error.message);
      return res.status(500).send({ message: "Failed to fetch lockers." });
    });
};
