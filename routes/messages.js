var express = require('express');
var router = express.Router();

const messages = require('../controllers/messages');

router.get('/', messages.get_all_messages);
router.get('/user/:id/', messages.get_user_messages);
router.get('/:id', messages.get_message);
router.post('/new', messages.new_message);
router.put('/:id/edit', messages.edit_message);
router.delete('/:id/remove', messages.delete_message);
module.exports = router;
