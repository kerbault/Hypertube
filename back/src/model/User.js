const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');


let UserSchema = new mongoose.Schema({
    username: {
        type: String,

        unique: true
    },
    firstname: String,
    lastname: String,
    email: {
        type: String,
        match: /[^@]+@[^@]+\.[\w]{1,255}/,
        required: true
    },
    password: {
        type: String,
    },
    picture: {
        type: String,
    },
    language: {
        type: String,
        default: "English"
    },
    ssoid: {
        intra: {
            type: String
        },
        google: {
            type: String
        }
    },
    googleId: String,
    fortytwoId: String,
    githubId: String,
    Token: String
});
mongoose.plugin(findOrCreate);
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
