var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Trying to fetch messages!');
});

module.exports = router;
