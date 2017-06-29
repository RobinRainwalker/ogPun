const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passportInstance = passport.initialize();
const passportSession = passport.session();

function restrict(req, res, next) {
    console.log(req.isAuthenticated());
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
        .findByUserName(userObj.userName)
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
                .create(req.body.user)
                .then((user) => {
                    return done(null, user);
                })
                .catch((err) => {
                    console.log('error from your local signup', err);
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
                .findByUserName(name)
                .then((user) => {
                    if (user) {
                        const isAuthed = bcrypt.compareSync(password, user.password_digest);
                        console.log('is Authd:')
                        console.log(isAuthed)
                        if (isAuthed) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    } else {
                        return done(null, false);
                    }
                });
        })
);

module.exports = { passportInstance, passportSession, restrict };
