const models = require('../models');

exports.show_messages = function(req, res) {
  return models.Message.findAll().then(message => {
    if(message.length)
      res.status(200).send(message);
    else
      res.status(404).send("No messages found")
  })
}