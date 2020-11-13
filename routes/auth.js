const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const authenticate = require('../controllers/middleware/authentication');

router.post('/register', auth.register);
router.get('/login', auth.login);
router.get('/logout', authenticate, auth.logout);
router.delete('/remove', authenticate, auth.remove);

module.exports = router;