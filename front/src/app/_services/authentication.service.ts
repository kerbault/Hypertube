import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import * as moment from "moment";
import {Router} from '@angular/router';

import {User} from '../_models';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient, private router: Router
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`http://localhost:8080/user/login`, {username, password})
            .pipe(map(user => {

                if (user && user.token) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    const expiresAt = moment().add(604800, 'second');
                    localStorage.setItem("TokenExpires", JSON.stringify(expiresAt.valueOf()));
                    this.currentUserSubject.next(user);
                    return user;
                }
            }));
    }

    verifi_tok(id: string, username: string, token: string) {
        return this.http.post<any>(`http://localhost:8080/user/token`, {username, token})
            .pipe(map(user => {
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    // setting expiration login expiration time [604800 == 1 Week]
                    const expiresAt = moment().add(604800, 'second');
                    localStorage.setItem('TokenExpires', JSON.stringify(expiresAt.valueOf()));
                    this.currentUserSubject.next(user);
                    return user;
                }
            }));
    }

    // function to get expiration date
    getExpiration() {
        const expiration = localStorage.getItem('TokenExpires');
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }

    // Verify if token is still valid
    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('TokenExpires');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }
}
