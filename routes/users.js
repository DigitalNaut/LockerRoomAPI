var express = require('express');
var router = express.Router();

const user = require('../controllers/users');

/* GET users view */
router.get('/', user.show_users);

/* GET users API */
router.get('/:id', user.show_user);
router.post('/new', user.new_user);

module.exports = router;
