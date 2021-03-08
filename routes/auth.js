const express = require('express');
const router = express.Router();
const {register, login, getamount, getme} = require('../controllers/auth');
const {protect} = require('../middleware/auth');

router.get('/me',protect, getme);
router.get('/:id',getamount);
router.post('/register', register);
router.post('/login', login);
module.exports = router;