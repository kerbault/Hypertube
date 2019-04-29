const express = require('express');
const router = express.Router();
const User = require('../model/User');
const FortyTwoStrategy = require('passport-42');
const passport = require('passport');
const Jwthandle = require('../util/jwt.handeler.js');

const FORTYTWO_APP_ID = '7f41faded62b4fbbe0b2cc08a72029cc05c590f8cb56edc954382350ee0a4536';
const FORTYTWO_APP_SECRET = '846a2c3199eaf6314c1c7ec88079fa4872e86631442d760278b058c86229ffff';

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});

passport.use(new FortyTwoStrategy({
	clientID: FORTYTWO_APP_ID,
	clientSecret: FORTYTWO_APP_SECRET,
	callbackURL: "http://localhost:8080/auth/42/redirect"
},
(accessToken, refreshToken, profile, done) => {
	User.findOne({$or: [{username: profile._json.login}, {email: profile._json.email}, {fortytwoId: profile.id}]}).then(currentUser => {
		if (currentUser) {
			if (currentUser._doc.fortytwoId == profile.id) {
				User.findOneAndUpdate(
						{fortytwoId: profile.id},
						{
							$set: {
								lastname: profile._json.name,
								firstname: profile._json.first_name,
								username: profile._json.login,
								email: profile._json.email,
								picture: profile._json.image_url
							}
						});
				return done(null, currentUser);
			} else
				return done(null, null);
			;
		} else {
			if (profile._json.email)
			{
				new User({
					firstname: profile._json.first_name,
					lastname: profile._json.last_name,
					fortytwoId: profile.id,
					username: profile._json.login,
					email: profile._json.email,
					picture: profile._json.image_url
				})
				.save().then(newUser => {
					return done(null, newUser);
				})
			}
			else
				return done(null, null);
		}
	});
}
));

router.get('/', passport.authenticate('42'));

router.get('/redirect', passport.authenticate('42', {failureRedirect: 'http://localhost:4200/login?error=2'}), (req, res) => {
		req.body.username = req.user._doc.username;
		let Token = Jwthandle.sign(req, res);
		delete (req.body.username);
		res.status(200).redirect('http://localhost:4200/login' + "?id=" + req.user._doc._id + "&username=" + req.user._doc.username + "&token=" + Token);
		});
module.exports = router;
