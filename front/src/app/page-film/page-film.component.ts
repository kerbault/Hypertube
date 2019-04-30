import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeHtml, SafeUrl, SafeStyle} from '@angular/platform-browser';
import {FilmService, UserService} from '../_services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// import { userInfo } from 'os';

@Component({
    templateUrl: './page-film.component.html',
    styleUrls: ['./page-film.component.scss']
})
export class PageFilmComponent implements OnInit {
    @Input() id: number;
    PostCom: FormGroup;
    title: string;
    affiche: SafeUrl;
    year: number;
    duration: number;
    genre = new Array();
    langue: string;
    description: string;
    background: SafeUrl;
    note: number;
    cast = new Array();
    submitted = false;
    loading = false;
    error = '';
    coms = new Array();
    i = 0;
    sub_path: string;
    id_tmp: string;
    id_imdb: string;
    src_video: SafeUrl;
    src_subtitles: SafeUrl;
    //subs = new Array();
    sub_en = new Array();
    sub_pref = new Array();
    user_pref = "";
    dl_ok = false;

    /*subs = JSON.parse(JSON.stringify({
      path: "",
      langue:"",
      langShort: ""}
    ));*/

    constructor(private filmService: FilmService,
                private userService: UserService,
                private route: ActivatedRoute,
                private sanitization: DomSanitizer,
                // private subtitlesService: SubtitlesService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {

        this.PostCom = this.formBuilder.group({
            com: ['', Validators.required]
        });

        let user = JSON.parse(localStorage.getItem("currentUser"));
        this.userService.getUser(user.id)
            .subscribe(
                data => {
                    this.user_pref = data.language;
                },
                error => {
                    console.log("get user error = ", error);
                });


        let regex1 = RegExp('^tt');
        if (regex1.test(this.route.snapshot.paramMap.get("id"))) {

            this.id_tmp = this.route.snapshot.paramMap.get("id");
            this.id = parseInt(this.id_tmp.split('t')[2]);
            this.filmService.getDetailFilmOMbd(this.route.snapshot.paramMap.get("id"))
                .subscribe(
                    data => {
                        let data2 = JSON.parse(JSON.stringify(data));
                        this.title = data2.name;
                        this.affiche = this.sanitization.bypassSecurityTrustUrl(data2.affiche);
                        this.year = data2.year;
                        this.duration = data2.duree;
                        this.genre = data2.genres;
                        this.langue = data2.langue;
                        this.description = data2.description;
                        this.background = this.sanitization.bypassSecurityTrustUrl(data2.background_image);
                        this.note = data2.rating;
                        this.cast = data2.cast;
                    },
                    error => {
                        console.log("get film error = ", error);
                    });
        } else {
            this.id = parseInt(this.route.snapshot.paramMap.get("id"));
            this.filmService.getDetailFilm(this.id)
                .subscribe(
                    data => {
                        let data2 = JSON.parse(JSON.stringify(data));
                        this.title = data2.name;
                        this.affiche = this.sanitization.bypassSecurityTrustUrl(data2.affiche);
                        this.year = data2.year;
                        this.duration = data2.duree;
                        this.genre = data2.genres;
                        this.langue = data2.langue;
                        this.description = data2.description;
                        this.background = this.sanitization.bypassSecurityTrustUrl(data2.background_image);
                        this.note = data2.rating;
                        this.cast = data2.cast;
                        this.id_imdb = data2.imdb_code;
                    },
                    error => {
                        console.log("get film error = ", error);
                    });
        }

        this.filmService.getComs(this.id)
            .subscribe(
                res => {
                    this.i = 0;
                    for (const da in res.com) {
                        this.coms[this.i] = res.com[this.i];
                        this.i = this.i + 1;
                    }
                },
                error => {
                    console.log("get coms error = ", error);
                });
    }

    get f() {
        return this.PostCom.controls;
    }

    onSubmit() {

        this.submitted = true;
        // stop here if form is invalid
        if (this.PostCom.invalid) {
            return;
        }
        this.loading = true;
        let user = JSON.parse(localStorage.getItem("currentUser"));
        this.filmService.addCom(this.id, user.id, this.f.com.value)
            .subscribe(
                data => {
                    location.reload();

                },
                error => {
                    this.error = error.error;
                    this.loading = false;
                });
    }
    myFunction()
    {
        this.affiche = '../assets/default_affiche.png';
    }

    onclick() {
        let user = JSON.parse(localStorage.getItem("currentUser"));
        let regex1 = RegExp('^tt');
        if (regex1.test(this.id_tmp)) {
            this.background = this.sanitization.bypassSecurityTrustUrl('/assets/sorry.png');
        } else {
            document.getElementById("image_before").style.display = 'none';
            this.src_video = this.sanitization.bypassSecurityTrustUrl("http://localhost:8080/api_getfilm_id/" + this.id + "/" + user.id);
        }
        this.filmService.getsub(this.id_imdb)
            .subscribe(
                data => {
                    let singleVideo = document.getElementById("singleVideo");
                    let i = 0;
                    for (const da in data) {
                        if (data[i].lang == "english" && data[i].path != '') {
                            let track = document.createElement("track");
                            track.kind = "subtitles";
                            track.label = "english";
                            track.srclang = "en";
                            track.src = 'http://localhost:8080/subtitle_path/' + data[i].path;
                            singleVideo.appendChild(track);
                        } else if (data[i].lang == this.user_pref && data[i].path != '') {
                            let track = document.createElement("track");
                            track.kind = "subtitles";
                            track.label = this.user_pref;
                            track.srclang = data[i].langShort;
                            track.src = 'http://localhost:8080/subtitle_path/' + data[i].path;
                            singleVideo.appendChild(track);
                        } else if (data[i].path !== ''){
                            let track = document.createElement("track");
                            track.kind = "subtitles";
                            track.label = data[i].lang;
                            track.srclang = data[i].langShort;
                            track.src = 'http://localhost:8080/subtitle_path/' + data[i].path;
                            singleVideo.appendChild(track);
                        }
                        i++;
                    }
                    this.dl_ok = true;
                },
                error => {
                    this.error = error.error;
                    this.loading = false;
                    this.dl_ok = true;
                });
    }
}
