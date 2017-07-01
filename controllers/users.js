const User = require('../models/user');
const router = require('express').Router();
const passport = require('passport');
// const controller = require('./controller') - not necessary (yet?)
const auth = require('../services/auth');
const background = require('../services/randimg.js');

// app.use('/', require('./controllers/users'));

// app.get('/', (req, res) => {
// 	console.log('Going to landing page')
// 	res.render('./landing');
// });

router.post('/', passport.authenticate(
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

router.get('/', (req, res) => {
res.render('landing');
console.log('rendering landing page')
});

// router.get('/front', auth.restrict, (req, res) => {
// 	res.render('front')
// });
router.get('/front', auth.restrict, (req, res) => {
    let renderObj = {};
    background
        .makeBackground()
        .then((bgImage) => {
            console.log('hello from the background control section')
            console.log(bgImage.data.urls.full)
            renderObj.image = bgImage.data.urls.full;
            res.render('front');
        })
    });

    router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    router.get('/profile', auth.restrict, (req, res) => {
        console.log('in handler for /profile');
        console.log('req.user:');
        console.log(req.user);
        User
            .findByUserName(req.user.username)
            .then((user) => {
                res.render(
                    'profile', { user: user }
                );
            })
            .catch(err => console.log('error: ', err));
    });

    module.exports = router;
