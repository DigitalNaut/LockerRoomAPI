var express = require('express');
var router = express.Router();

const lockers = require('../controllers/lockers');
const authenticate = require('../controllers/middleware/authentication');

router.get('/', authenticate, lockers.show_lockers);

module.exports = router;
