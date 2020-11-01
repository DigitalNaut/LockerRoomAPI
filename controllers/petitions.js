const models = require('../models');

exports.show_petitions = function(req, res) {
  return models.Petition.findAll()
    .then((petitions) => {
      if (petitions.length) res.status(200).send(petitions);
      else res.status(501).send({ message: "No petitions found" });
    })
    .catch((err) => {
      res.status(500).send({ message: "Failed to fetch petitions." });
      console.log("Error fetching petitions:", error.message);
    });
}