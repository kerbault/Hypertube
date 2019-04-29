const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');


let ComShema = new mongoose.Schema({
    id_user: String,
    id_film: Number,
    com: String,
    date: Date
});
mongoose.plugin(findOrCreate);
mongoose.model('Com', ComShema);

module.exports = mongoose.model('Com');
