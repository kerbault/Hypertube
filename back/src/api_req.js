const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
let sortByProperty = function (property) {
    return function (x, y) {
        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
    };
};
module.exports = {
    api_req: function (req, res) {
        let i = 0;
        let j = 20; //nombre de film par page
        let k = 0;
        let tab = new Array();
        requete = "https://yts.am/api/v2/list_movies.json?sort_by=year&limit=" + j + "&quality=1080p&page=" + req.query.page;
        if (req.query.note_min)
            requete = requete + "&minimum_rating=" + req.query.note_min;
        else
            requete = requete + "&minimum_rating=6";

        if (req.query.tri) {
            requete = requete + "&sort_by=" + req.query.tri + "&order_by=asc";
        }
        if (req.query.genre) {
            requete = requete + "&genre=" + req.query.genre;
        }
        fetch(requete)
            .then((res) => res.json())
            .then(async data => {
                if ((req.query.year_min == 'null') || (req.query.year_min == "")) {
                    year_min = 0;
                } else {
                    year_min = req.query.year_min
                }
                ;
                if ((req.query.year_max == 'null') || (req.query.year_min == "")) {
                    year_max = 10000;
                } else {
                    year_max = req.query.year_max
                }
                ;
                if (data.data.movie_count < 20) {
                    j = data.data.movie_count;
                    page_max = 1;
                } else {
                    page_max = data.data.movie_count / 20;
                }
                if (req.query.page <= page_max) {
                    //let last_id = data.data.movies[0].id
                    while (i < j) {
                        if (i != 0) {
                            last_id = data.data.movies[i - 1].id;
                        } else {
                            last_id = 0
                        }
                        if ((data.data.movies[i].year >= year_min) && (data.data.movies[i].year <= year_max) && (data.data.movies[i].id != last_id)) {
                            str = JSON.stringify({
                                name: data.data.movies[i].title,
                                year: data.data.movies[i].year,
                                genres: data.data.movies[i].genres,
                                affiche: data.data.movies[i].large_cover_image,
                                synopsis: data.data.movies[i].synopsis.substr(0, 119) + "...",
                                duree: data.data.movies[i].runtime,
                                rating: data.data.movies[i].rating,
                                id: data.data.movies[i].id
                            });
                            tab[k] = JSON.parse(str);
                            k++;
                        }
                        i++;
                    }
                }

                res.status(200).json(tab);

            })
    },

    api_by_id: function (req, res, id) {
        fetch("https://yts.am/api/v2/movie_details.json?movie_id=" + id + "&with_cast=true")
            .then((res) => res.json())
            .then(async data => {
                str = JSON.stringify({
                    name: data.data.movie.title,
                    year: data.data.movie.year,
                    genres: data.data.movie.genres,
                    affiche: data.data.movie.large_cover_image,
                    duree: data.data.movie.runtime,
                    rating: data.data.movie.rating,
                    langue: data.data.movie.language,
                    description: data.data.movie.description_full,
                    background_image: data.data.movie.background_image,
                    cast: data.data.movie.cast,
                    imdb_code: data.data.movie.imdb_code,
                    id: data.data.movie.id
                });
                str = JSON.parse(str);
                res.status(200).json(str);
            })
    },

    api_research: function (req, res) {
        let i = 0;
        let j = 20; //nombre de film par page
        let k = 0;
        let tab = new Array();
        let requete = "https://yts.am/api/v2/list_movies.json?query_term=" + req.query.search + "&limit=20&page=" + req.query.page;
        if (req.query.tri) {
            requete = requete + "&sort_by=" + req.query.tri;
        } else {
            requete = requete + "&sort_by=title" + "&order_by=asc";
        }
        if (req.query.genre) {
            requete = requete + "&genre=" + req.query.genre;
        }
        if (req.query.note_min)
            requete = requete + "&minimum_rating=" + req.query.note_min;

        fetch(requete)
            .then((res) => res.json())
            .then(async data => {
                if ((req.query.year_min == 'null') || (req.query.year_min == "")) {
                    year_min = 0;
                } else {
                    year_min = req.query.year_min
                }

                if ((req.query.year_max == 'null') || (req.query.year_max == "")) {
                    year_max = 10000;
                } else {
                    year_max = req.query.year_max
                }

                if (data.data.movie_count) {
                    if (data.data.movie_count < 20) {
                        j = data.data.movie_count;
                        page_max = 1;
                    } else {
                        page_max = data.data.movie_count / 20;
                    }
                    if (req.query.page <= page_max) {
                        while (i < j) {
                            if ((data.data.movies[i].year >= year_min) && (data.data.movies[i].year <= year_max)) {
                                str = JSON.stringify({
                                    name: data.data.movies[i].title,
                                    year: data.data.movies[i].year,
                                    genres: data.data.movies[i].genres,
                                    affiche: data.data.movies[i].large_cover_image,
                                    synopsis: data.data.movies[i].synopsis.substr(0, 119) + "...",
                                    duree: data.data.movies[i].runtime,
                                    rating: data.data.movies[i].rating,
                                    imdb_code: data.data.movies[i].imdb_code,
                                    id: data.data.movies[i].id
                                });
                                tab[k] = JSON.parse(str);
                                k++;
                            }
                            i++;
                        }
                    }
                    return tab;
                    //res.status(200).json(tab);
                }
            })
            .then(tab => {
                fetch('http://www.omdbapi.com/?apikey=b52706c0&s=' + req.query.search)
                    .then((result) => result.json())
                    .then(async data2 => {
                        i = 0;
                        j = 0;
                        k = 0;
                        let exist = false;
                        newtab = new Array();
                        if (data2.Response == 'True') {
                            while (j < data2.Search.length) {
                                while (i < tab.length) {
                                    if (tab[i].imdb_code == data2.Search[j].imdbID) {
                                        tab[i].year = data2.Search[j].Year;
                                        exist = true
                                    }
                                    i++;
                                }
                                if (exist == false) {
                                    var unseen = JSON.stringify({
                                        name: data2.Search[j].Title,
                                        year: data2.Search[j].Year,
                                        genres: "ND",
                                        affiche: data2.Search[j].Poster,
                                        synopsis: "".substr(0, 119) + "...",
                                        duree: "ND",
                                        rating: "ND",
                                        imdb_code: data2.Search[j].imdbID,
                                        id: data2.Search[j].imdbID
                                    });
                                    newtab[k] = JSON.parse(unseen);
                                    k = k + 1;
                                }
                                exist = false;
                                j++;
                                i = 0;
                            }
                            if (req.query.page <= page_max)
                                tab = tab.concat(newtab);
                        } else {
                            return tab;
                        }
                        return tab;
                    }).then(resul => {
                    if (resul) {
                        if (req.query.tri != 'title') {
                            resul.sort(sortByProperty(req.query.tri));
                        } else {
                            resul.sort(sortByProperty('name'));
                        }
                    }
                    res.status(200).json(resul);
                });
            })
    },


    api_by_id_omdb: function (req, res, id) {
        fetch("http://www.omdbapi.com/?apikey=b52706c0&i=" + id + "&plot=full")
            .then((res) => res.json())
            .then(async data => {
                cast_form = data.Actors.split(',');
                cast_final = new Array();
                str2 = "";
                for (let index = 0; index < cast_form.length; index++) {
                    str2 = JSON.stringify({name: cast_form[index], character_name: ""});
                    cast_final[index] = JSON.parse(str2);
                }
                str = JSON.stringify({
                    name: data.Title,
                    year: data.Year,
                    genres: data.Genre,
                    affiche: data.Poster,
                    duree: data.Runtime,
                    rating: data.imdbRating,
                    langue: data.Language,
                    description: data.Plot,
                    background_image: data.Poster,
                    cast: cast_final,
                    id: data.imdbID
                });
                str = JSON.parse(str);
                res.status(200).json(str);
            })
    },

    film_by_id: function (id_movie) {
        return new Promise((resolve, reject) => {
            fetch("https://yts.am/api/v2/movie_details.json?movie_id=" + id_movie + "&with_cast=true")
                .then((res) => res.json())
                .then(async data => {
                    if (data) {
                        if (data.data.movie.torrents.length > 1) {
                            if (data.data.movie.torrents[0].seeds > data.data.movie.torrents[1].seeds) {
                                hash = data.data.movie.torrents[0].hash;
                            } else {
                                hash = data.data.movie.torrents[1].hash;
                            }
                        } else {
                            hash = data.data.movie.torrents[0].hash;

                        }

                        str = JSON.stringify({
                            hash: hash,
                            duree: data.data.movie.runtime,
                            id: data.data.movie.id //,
                            // name: data.data.movie.title,
                            // year: data.data.movie.year,
                            // genres: data.data.movie.genres,
                            // affiche: data.data.movie.large_cover_image,
                            // rating: data.data.movie.rating,
                            // langue: data.data.movie.language,
                            // description: data.data.movie.description_full,
                            // background_image: data.data.movie.background_image,
                            // cast: data.data.movie.cast,
                        });
                        str = JSON.parse(str);
                        resolve(str);
                        //return (str);
                        //res.status(200).json(str);
                        //return ("lol");
                    } else
                        reject({status: 400, message: "error no film found"})
                })

        })
    },
};