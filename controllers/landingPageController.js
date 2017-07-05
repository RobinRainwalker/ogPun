const router = require('express').Router();
const passport = require('passport');
const auth = require('../services/auth');
const background = require('../services/randimg.js');
const Models = require('../models/models');
const User = Models.User;

module.exports = router;