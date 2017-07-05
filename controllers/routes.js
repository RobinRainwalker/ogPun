const router = require('express').Router();
const passport = require('passport');
const auth = require('../services/auth');
const controllers = require('./controllers.js');
const Models = require('../models/models');
const User = Models.User;
const FPC = controllers.frontPageController;
const PPC = controllers.profilePageController;
const LPC = controllers.landingPageController;

router.get('/', (req, res) => {
    console.log('Going to landing page')
    res.render('./landing');
});

router.post('/signup', passport.authenticate(
    'local-signup', {
        failureRedirect: '/',
        successRedirect: '/front'
    }
));

router.post('/login', passport.authenticate(
    'local-login', {
        failureRedirect: '/',
        successRedirect: '/front'
    }
));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/front', FPC.getFrontPage);

router.delete('/user/delete', auth.restrict, User.deleteUserById);

// profile page routes

router.get('/profile', auth.restrict, PPC.getProfilePage);

router.post('/profile', auth.restrict, PPC.getUserName);


// front page routes

router.post('/comment', auth.restrict, FPC.postComment);

router.post('/giggle', auth.restrict, FPC.addGiggle);

router.post('/groan', auth.restrict, FPC.addGroan);

module.exports = router;














