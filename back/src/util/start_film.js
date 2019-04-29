const api = require('../api_req');
const magnet = require('../util/magnet');
const download = require('../download');

module.exports = {
    flux_video: function (req, res, id_user, id_movie) {
        api.film_by_id(id_movie).then(data => {
            magnet.magnet_creation(data.hash).then(data => {
                download(data, res, id_movie, id_user)
            });
        })
    },
};