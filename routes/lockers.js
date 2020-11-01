var express = require('express');
var router = express.Router();

const lockers = require('../controllers/lockers');

router.get('/', lockers.show_lockers);

module.exports = router;
