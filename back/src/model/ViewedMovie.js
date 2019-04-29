const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const ViewedMovieSchema = new mongoose.Schema({
    User_ID: {
        type: String,
        required: true
    },
    Movie_ID: {
        type: String,
        required: true
    },
    Date_vue: {
        type: Date,
        required: true
    }

});

const ViewedMovie = mongoose.model('ViewedMovie', ViewedMovieSchema);
ViewedMovieSchema.plugin(findOrCreate);

module.exports = ViewedMovie;
