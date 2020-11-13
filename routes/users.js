var express = require('express');
var router = express.Router();

const user = require('../controllers/users');
const authenticate = require("../controllers/middleware/authentication");

router.get('/all', authenticate, user.get_all_users);
router.get('/:username', user.get_user);
router.post('/new', user.new_user);
router.put('/modify/:username', authenticate, user.modify_user);
router.delete('/remove', authenticate, user.delete_user);

module.exports = router;
