const TorrentStream = require('torrent-stream');
const fs = require('fs');
const pump = require('pump');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const MovieList = require('./model/ViewedMovie');

const opts = {
    // connections: 100,     // Max amount of peers to be connected to.
    // uploads: 10,          // Number of upload slots.
    // tmp: './streams',          // Root folder for the files storage.
    // Defaults to '/tmp' or temp folder specific to your OS.
    // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash}
    path: './streams/', // Where to save the files. Overrides `tmp`.
    // verify: true,         // Verify previously stored data before starting
    // Defaults to true
    // dht: true,            // Whether or not to use DHT to initialize the swarm.
    // Defaults to true
    // tracker: true,        // Whether or not to use trackers from torrent file or magnet link
    // Defaults to true
    trackers: [
        'udp://open.demonii.com:1337/announce',
        'udp://tracker.openbittorrent.com:80',
        'udp://tracker.coppersurfer.tk:6969',
        'udp://glotorrents.pw:6969/announce',
        'udp://tracker.opentrackr.org:1337/announce',
        'udp://torrent.gresille.org:80/announce',
        'udp://p4p.arenabg.com:1337',
        'udp://tracker.leechers-paradise.org:6969'],
    // Allows to declare additional custom trackers to use
    // Defaults to empty
    // storage: myStorage()  // Use a custom storage backend rather than the default disk-backed one
};
const insertFilmDB = (userID, filmID) => {
    return new Promise((resolve, reject) => {
        let movie = new MovieList({
            User_ID: userID,
            Movie_ID: filmID,
            Date_vue: Date.now()
        });
        MovieList.findOne({User_ID: userID, Movie_ID: filmID}).then(doc => {
            if (doc) {
                resolve('already exist');
            } else {
                movie.save(error => {
                    if (error) {
                        reject("viewed movie not saved, error : ", error);
                    } else {
                        resolve('viewed movies saved.');
                    }
                });
            }
        });
    })
};

const downloadTorrent = (magnet, res, filmID, userID) => {

    let engine = TorrentStream(magnet, opts);

    engine.on('ready', () => {
        // console.log("dans dowload torent AND userID, = ", userID, " filmID  = ", filmID);
        insertFilmDB(userID, filmID);
        engine.files.sort((a, b) => b.length - a.length);

        let file = engine.files[0];

        let stream = file.createReadStream();

        let conversion = ffmpeg(stream)
            .withVideoCodec("libvpx")
            .withVideoBitrate("4000")
            .withAudioCodec("libvorbis")
            .withAudioBitrate("256k")
            .audioChannels(2)
            .outputOptions([
                "-preset ultrafast",
                "-deadline realtime",
                "-error-resilient 1",
                "-movflags +faststart",
            ])
            .format("matroska");
        res.contentType('video/webm');
        res.on("close", () => {
            conversion.kill("SIGTERM")
        });
        pump(conversion, res);
    });

    // engine.on('download', () => {
    //     console.log(engine.swarm.downloaded);
    // })
};

module.exports = downloadTorrent;