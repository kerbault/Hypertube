import {Component, OnInit, Input} from '@angular/core';
import {FilmService, HyperMovies} from '../_services';
import {
    debounceTime,
    distinctUntilChanged,
    switchMap,
    flatMap,
    delay,
    mergeMap,
    concatMap,
    timeInterval
} from 'rxjs/operators';
import {Observable, Subject, merge, concat} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {async} from 'q';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent {
    @Input() contenu: string;
    films = new Array();
    i = 0;
    j = 0;
    k = 2;
    p = 1;
    recherche = false;
    key_word = '';
    triForm: FormGroup;
    submitted = false;
    loading = false;
    error = '';
    tri = '';
    genre = '';
    note_min = '';
    year_min = '';
    year_max = '';
    movies$ = new Array();
    last_key = '';


    search(event: any, research: string) {
        let ist_ok = false;
        if (event.keyCode) {
            if (this.last_key != event.keyCode) {
                this.last_key = event.keyCode;
                ist_ok = true;
            } else
                ist_ok = false;
        } else {
            ist_ok = true;
        }
        const regex1 = RegExp('[a-zA-Z0-9]+');
        if (research !== '' && !regex1.test(research)) {
            ist_ok = false;
        }
        if (research !== '' && ist_ok) {
            this.films = new Array();   // on vide films
            this.i = 0;                 // on remet i a 0
            this.j = 0;                 // on remet j a 0 pour qu'a chaque mot ou entree on remplace les results
            this.movies$ = new Array(); // on vide movie$ pour qu'a chaque mot ou entree on remplace les results
            this.k = 1;                 // on remet k a 1
            this.key_word = research;   // on stock les mots cle
            this.recherche = true;      // on passe en mode recherche
            if (event.keyCode === 13 || event.keyCode === 32 || event === '') {
                this.filmService.Research(research, this.p, this.tri, this.genre, this.note_min, this.year_min, this.year_max).pipe(debounceTime(500))
                    .subscribe(
                        data => {
                            for (const da in data) {
                                this.movies$[this.j] = data[this.j];
                                this.j = this.j + 1;
                            }
                        },
                        error => {
                            console.log('get film error = ', error);
                        });
            }
        } else if (ist_ok) {
            this.j = 0;                 // on remat j a 0
            this.movies$ = new Array(); // on vide movies
            this.p = 1;                 // on remet p a 1
            this.recherche = false;     // on desactive le mode recherche
            this.tri = '';              // on reset pour avoir les suggestions
            this.genre = '';            // on reset pour avoir les suggestions

            if (!this.films.length && ist_ok) {
                this.filmService.getFilm(this.k, this.tri, this.genre, this.note_min, this.year_min, this.year_max)
                    .subscribe(
                        data => {
                            for (const da in data) {
                                this.films[this.i] = data[this.i];
                                this.i = this.i + 1;
                            }
                        },
                        error => {
                            console.log('get film error = ', error);
                        });
            }
        }

    }


    constructor(private filmService: FilmService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.triForm = this.formBuilder.group({
            tri: ['', Validators],
            filtre: ['', Validators],
            note_min: ['', Validators],
            year_min: ['', Validators],
            year_max: ['', Validators]
        });
        this.filmService.getFilm(1, this.tri, this.genre, this.note_min, this.year_min, this.year_max)
            .subscribe(
                data => {
                    for (const da in data) {
                        this.films[this.i] = data[this.i];
                        this.i = this.i + 1;
                    }
                },
                error => {
                    console.log('get film error = ', error);
                });
    }

    onScroll() {
        if (!this.recherche) {
            this.filmService.getFilm(this.k, this.tri, this.genre, this.note_min, this.year_min, this.year_max)
                .subscribe(
                    data => {
                        let d = 0;
                        for (const da in data) {
                            this.films[this.i] = data[d];
                            this.i = this.i + 1;
                            d++;
                        }
                    },
                    error => {
                        console.log('get film error = ', error);
                    });
            this.k++;
        } else {
            this.p++;
            this.filmService.Research(this.key_word, this.p, this.tri, this.genre, this.note_min, this.year_min, this.year_max)
                .subscribe(
                    data => {
                        let d = 0;
                        for (const da in data) {
                            this.movies$[this.j] = data[d];
                            this.j = this.j + 1;
                            d++;
                        }
                    },
                    error => {
                        console.log('get film error = ', error);
                    });
        }
    }

    get f() {
        return this.triForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.triForm.invalid) {
            return;
        }

        this.tri = this.f.tri.value;
        this.genre = this.f.filtre.value;
        this.note_min = this.f.note_min.value;
        this.year_min = this.f.year_min.value;
        this.year_max = this.f.year_max.value;
        if (this.genre === undefined) {
            this.genre = '';
        }
        this.j = 0;
        if (this.recherche) {
            this.j = 0;
            this.p = 1;
            this.search('', this.key_word);
        } else {
            this.i = 0;
            this.films = new Array();
            this.filmService.getFilm(1, this.tri, this.genre, this.note_min, this.year_min, this.year_max)
                .subscribe(
                    data => {
                        for (const da in data) {
                            this.films[this.i] = data[this.i];
                            this.i = this.i + 1;
                        }
                    },
                    error => {
                        console.log('get film error = ', error);
                    });
        }
    }
}

