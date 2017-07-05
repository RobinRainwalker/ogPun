const router = require('express').Router();
const passport = require('passport');
const auth = require('../services/auth');
const Models = require('../models/models');
const User = Models.User;

const getProfilePage = (req, res) => {
    console.log('in handler for /profile');
    console.log('req.user:');
    console.log(req.user);
    User
        .findUserByUsername(req.user.username)
        .then((user) => {
            res.render(
                'profile', { user: user }
            );
        })
        .catch(err => console.log('error: ', err));
};

const getUserName = (req, res) => {
    res.json({username: req.user.username});
};

module.exports = {getProfilePage, getUserName };