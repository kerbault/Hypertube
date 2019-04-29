const fs = require('fs');
const jwt = require('jsonwebtoken');
const send_mail = require('nodemailer');
const User = require('../model/User');

let privateKEY = fs.readFileSync('./src/util/jwt.private.key', 'utf8');

module.exports = {
    sign: function (req, res) {

        let sign_opt = {
            issuer: "back",
            subject: "back",
            audience: req.body.username
        };
        return jwt.sign({}, privateKEY, sign_opt);
    },

    verify: function (req, res, next) {
        let token = req.headers["authorization"];
        let verif_opt = {
            issuer: "back",
            subject: "back",
            audience: req.query.username
        };
        jwt.verify(token, privateKEY, verif_opt, function (err, decoded) {
            if (err)
                res.status(401).json("Token Invalid or Expired");
            else
                next();
        });
    },


}
