var express = require('express');
var router = express.Router();

const user = require('../controllers/users');

router.get('/', user.get_all_users);
router.get('/:id', user.get_user);
router.post('/new', user.new_user);
router.put('/:id/edit', user.edit_user);
router.delete('/:id/remove', user.delete_user);

module.exports = router;
