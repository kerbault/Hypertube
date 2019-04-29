const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const yifysubtitles = require('yifysubtitles');
const fs = require('fs');
const pump = require('pump');

module.exports = {
    get_subtitle: function (req, res, imdb_code, langue) {

        const basePath = './subtitles';
        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath);
        }

        yifysubtitles(imdb_code, {path: basePath, langs: langue})
            .then(subs => {

                let i = 0;
                for (let element in subs) {
                    const pathRet = `${basePath}/${imdb_code}-${subs[i].langShort}.${subs[i].path.split('.').pop()}`;
                    path_name = `${imdb_code}-${subs[i].langShort}.${subs[i].path.split('.').pop()}`;
                    fs.rename(subs[i].path, pathRet, e => {
                        if (e) console.log(e);
                    });
                    subs[i].path = path_name;
                    i++;
                }
                res.status(200).json(subs);
            })
            .catch(err => {
                res.status(400).json({'message': err});
            });
    },

    get_subtitle_path: function (req, res, sub_path) {
        const basePath = './subtitles/';
        let path = basePath + sub_path
        res.writeHead(200, {'Content-Type': 'text/vtt'});
        let stream = fs.createReadStream(path);
        pump(stream, res);
    }

};