const User = require('../models/user');
const router = require('express').Router();
const passport = require('passport');
// const controller = require('./controller') - not necessary (yet?)
const auth = require('../services/auth');

router.get('/', (req, res) => {
	res.render('landing');
	console.log('rendering landing page')
});

router.get('/front', auth.restrict, (req, res) => {
	res.render('front')
});

router.post('/', passport.authenticate(
	'local-signup', {
		failureRedirect: '/',
		successRedirect: '/front'
	}
));

router.post('/', passport.authenticate(
	'local-login', {
		failureRedirect: '/',
		successRedirect: '/front'
	}
));

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
})

router.get('/profile', auth.restrict, (req, res) => {
	console.log('in handler for /profile');
	console.log('req.user:');
	console.log(req.user);
	User
		.findByUserName(req.user.userName)
		.then((user) => {
			res.render(
				'profile', { user: user }
				);
		})
		.catch(err => console.log('error: ', err));
})

module.exports = router;





