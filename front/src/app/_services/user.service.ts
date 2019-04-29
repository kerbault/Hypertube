import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {User} from '../_models';

@Injectable({providedIn: 'root'})
export class UserService {
    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<User[]>(`/users`);
    }

    register(username: string, firstname: string, lastname: string, password: string, password2: string, mail: string, avatar: string) {
        return this.http.post<any>(`http://localhost:8080/user/create`, {
            username,
            firstname,
            lastname,
            password,
            password2,
            mail,
            avatar
        })
            .pipe(map(res => {
                return res;
            }));
    }

    getUser(id: string) {
        return this.http.get<any>(`http://localhost:8080/users/` + id, {})
            .pipe(map(res => {
                return res;
            }));
    }

    modifyInfo(firstname: string, lastname: string, mail: string, language: string, oldmail: string,) {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        const id = user.id;
        return this.http.post<any>(`http://localhost:8080/user/modify_info`, {
            firstname,
            lastname,
            mail,
            language,
            oldmail,
            id
        })
            .pipe(map(res => {
                return res;
            }));
    }

    modifyLog(username: string, password: string, password2: string, oldusername: string) {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        const id = user.id;
        return this.http.post<any>(`http://localhost:8080/user/modify_log`, {
            username,
            password,
            password2,
            oldusername,
            id
        })
            .pipe(map(res => {
                return res;
            }));
    }

    modifyAvatar(path: string) {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        const id = user.id;
        return this.http.post<any>(`http://localhost:8080/user/modify_avatar`, {path, id})
            .pipe(map(res => {
                return res;
            }));
    }

    ForgetPass(mail: string) {
        return this.http.post<any>(`http://localhost:8080/user/forgotPassword`, {mail})
            .pipe(map(res => {
                return res;
            }));

    }

    /*modifyPassword(password: string, password2: string) {

    }*/
}
