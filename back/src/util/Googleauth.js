const express = require('express');
const router = express.Router();
const User = require('../model/User');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const Jwthandle = require('../util/jwt.handeler.js');
const bcrypt = require('bcrypt');
const Check = require('../util/check');

const GOOGLE_APP_ID = '669911811352-bdsbd20jmanch9e915t6ig1atn7c6lu2.apps.googleusercontent.com';
const GOOGLE_APP_SECRET = 'CdYCIdfJZ32cP6COig1dcchm';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

const saveToSession = (req, res) => {
    const payload = {
        _id: req.user._id,
        username: req.user.username
    };
    req.session.user = payload;
    req.save((err) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/');
        }
    });
};

passport.use(new GoogleStrategy({
        clientID: GOOGLE_APP_ID,
        clientSecret: GOOGLE_APP_SECRET,
        callbackURL: "http://localhost:8080/auth/google/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
        let Firstname = profile._json.given_name;
        let Lastname = profile._json.family_name;
        let email = profile._json.email;
        let Username = profile._json.given_name;

        User.findOne({$or: [{username: profile._json.given_name}, {email: profile._json.email}, {googleId: profile.id}]}).then((currentUser) => {
            if (currentUser) {
                if (profile._json.email) {
                    if (currentUser._doc.googleId == profile.id) {
                        User.findOneAndUpdate(
                            {fortytwoId: profile.id},
                            {
                                $set: {
                                    lastname: Lastname,
                                    firstname: Firstname,
                                    username: profile._json.given_name,
                                    email: profile._json.email,
                                    picture: profile._json.picture
                                }
                            });
                        return done(null, currentUser);
                    } else {
                        return done(null, null);
                    }
                } else
                    return done(null, null);
            } else {
                user = new User({
                    "username": Username,
                    "firstname": Firstname,
                    "lastname": Lastname,
                    "email": email,
                    picture: profile._json.picture,
                    googleId: profile.id
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        })
    }
));


router.get('/', passport.authenticate('google', {
        scope: ['profile', 'email']
    }
));

router.get('/redirect', passport.authenticate('google', {failureRedirect: "http://localhost:4200/login?error=3"}),
    (req, res) => {
        req.body.username = req.user._doc.username;
        let Token = Jwthandle.sign(req, res);
        delete (req.body.username);
        res.status(200).redirect('http://localhost:4200/login' + "?id=" + req.user._doc._id + "&username=" + req.user._doc.username + "&token=" + Token);

    });

module.exports = router;