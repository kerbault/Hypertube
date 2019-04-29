import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';

export interface HyperMovies {
    name: string;
    year: string;
    duree: string;
    affiche: string;
    synopsis: string;
    rating: string;
    id: string;
}

@Injectable({providedIn: 'root'})
export class FilmService {
    constructor(private http: HttpClient) {
    }

    getFilm(nb: number, tri: string, genre: string, note_min: string, year_min: string, year_max: string) {
        const Param = new HttpParams().set("tri", tri).set("genre", genre).set("note_min", note_min).set("year_min", year_min).set("year_max", year_max).set("page", nb.toString());
        return this.http.get('http://localhost:8080/api/', {params: Param})
    }

    getDetailFilm(id: number) {
        return this.http.get('http://localhost:8080/api_by_id/' + id);
    }

    getDetailFilmOMbd(id: string) {
        return this.http.get('http://localhost:8080/api_by_id_omdb/' + id);
    }

    addCom(id_film: number, id_user: string, com: string) {

        return this.http.post<any>(`http://localhost:8080/film/create`, {id_film, id_user, com})
            .pipe(map(res => {
                return (res);
            }));
    }

    getComs(id: number) {
        return this.http.get<any>('http://localhost:8080/film/getComs/' + id, {})
            .pipe(map(res => {
                return res;
            }));
    }

    Research(search: string, nb: number, tri: string, genre: string, note_min: string, year_min: string, year_max: string) {
        if (search != "") {
            const Param = new HttpParams().set("search", search).set("tri", tri).set("genre", genre).set("note_min", note_min).set("year_min", year_min).set("year_max", year_max).set("page", nb.toString());
            return this.http.get('http://localhost:8080/research', {params: Param});
        }
    }

    get_film_by_id(id_movie: number) {
        return this.http.get<any>('http://localhost:8080/api_getfilm_id/' + id_movie);
    }

    getsub(id_imdb: string) {
        return this.http.get<any>('http://localhost:8080/subtitle/' + id_imdb);
    }

    getViewed(id_movie: number, id_user: string) {
        const Param = new HttpParams().set("id_movie", id_movie.toString()).set("id_user", id_user);
        return this.http.get('http://localhost:8080/film/getViewed', {params: Param});
    }
}