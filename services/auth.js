const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passportInstance = passport.initialize();
const passportSession = passport.session();
const Models = require('../models/models');
const User = Models.User;

function restrict(req, res, next) {
    console.log('restrict test', req.isAuthenticated());
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((userObj, done) => {
    User
        .findUserByUsername(userObj.username)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            console.log(`error in deserializeUser: ${err}`);
            done(null, false);
        });
});

passport.use(
    'local-signup',
    new LocalStrategy({
            usernameField: 'user[name]',
            passwordField: 'user[password]',
            passReqToCallback: true
        },
        (req, name, password, done) => {
            User
                .createUser(req.body.user)
                .then((user) => {
                    return done(null, user);
                    console.log('before error: ', user)
                })
                .catch((err) => {
                    console.log(req.body.user, User, 'error from your local signup', err);
                    // console.log(user.userName, user.password)
                    return done(null, false)
                });
        })
);

passport.use(
    'local-login',
    new LocalStrategy({
            usernameField: 'user[name]',
            passwordField: 'user[password]',
            passReqToCallback: true
        },
        (req, name, password, done) => {
            User
                .findUserByUsername(name)
                .then((user) => {
                    if (user) {
                        const isAuthed = bcrypt.compareSync(password, user.password_digest);
                        // console.log('is Authd:')
                        // console.log(isAuthed)
                        if (isAuthed) {
                            return done(null, user);
                        } else {
                            // console.log('Found user but login failed.')
                            return done(null, false);
                        }
                    } else {
                        // console.log('No user found.');
                        return done(null, false);
                    }
                });
        })
);

module.exports = { passportInstance, passportSession, restrict };
