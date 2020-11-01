var express = require('express');
var router = express.Router();

const user = require('../controllers/users');

/* Welcome view */
router.get('/', user.show_users);

/* API */
router.get('/:id', user.show_user);
router.post('/new', user.new_user);
router.put('/:id/edit', user.edit_user);
router.delete('/:id/remove', user.remove_user);

module.exports = router;
