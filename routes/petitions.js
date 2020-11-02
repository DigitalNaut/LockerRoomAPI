var express = require('express');
var router = express.Router();

const petitions = require('../controllers/petitions');

router.get('/', petitions.get_all_petitions);
router.get('/:id', petitions.get_petition);
router.post('/new', petitions.new_petition);
router.put('/:id/edit', petitions.edit_petition);
router.delete('/:id/remove', petitions.delete_petition);

module.exports = router;
