const express = require('express');
const router = express.Router();
const User = require('../model/User');
const GithubStrategy = require('passport-github');
const passport = require('passport');
const Jwthandle = require('../util/jwt.handeler.js');


const GITHUB_APP_ID = 'd47ae1de420e380f375e';
const GITHUB_APP_SECRET = 'b05fa8b220c66358f1021c23c1649a23939f6485';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});


passport.use(new GithubStrategy({
        clientID: GITHUB_APP_ID,
        clientSecret: GITHUB_APP_SECRET,
        callbackURL: "http://localhost:8080/auth/github/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({$or: [{username: profile._json.login}, {email: profile._json.email}, {githubId: profile.id}]}).then(currentUser => {
            if (currentUser) {
                if (currentUser._doc.githubId == profile.id) {
                    User.findOneAndUpdate(
                        {githubId: profile.id},
                        {
                            $set: {
                                lastname: profile._json.name,
                                firstname: profile._json.name,
                                username: profile._json.login,
                                email: profile._json.email,
                                picture: profile._json.avatar_url
                            }
                        });
                    return done(null, currentUser);
                } else
                    return done(null, null);
            } else {
				if (profile._json.email)
				{
                new User({
                    lastname: profile._json.name,
                    firstname: profile._json.name,
                    githubId: profile.id,
                    username: profile._json.login,
                    email: profile._json.email,
                    picture: profile._json.avatar_url
                })
                    .save().then(newUser => {
                    return done(null, newUser);
                })
			}
			else
				return done(null, null);
            }
        });
    }));

router.get('/', passport.authenticate('github'));

router.get('/redirect', passport.authenticate('github', {failureRedirect: 'http://localhost:4200/login?error=1'}), (req, res) => {
    req.body.username = req.user._doc.username;
    let Token = Jwthandle.sign(req, res);
    delete (req.body.username);
    res.status(200).redirect('http://localhost:4200/login' + "?id=" + req.user._doc._id + "&username=" + req.user._doc.username + "&token=" + Token);
});
module.exports = router;
