const express = require('express')
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { forwardAuthenticated } = require('../config/auth');

//welcome 
router.get('/',forwardAuthenticated, (req, res) => res.render('welcome'));
module.exports = router;