import {Component, OnInit, Input} from '@angular/core';
import {DomSanitizer, SafeHtml, SafeUrl, SafeStyle} from '@angular/platform-browser';
import {combineAll} from 'rxjs/operators';
import {Com} from '../_models';
import {UserService} from '../_services';

@Component({
    selector: 'commentaire',
    templateUrl: './commentaire.component.html',
    styleUrls: ['./commentaire.component.scss']
})
export class CommentaireComponent implements OnInit {

    @Input() com: Com;
    login_user: string;
    avatar_user: SafeUrl;
    date: string;
    heure: string;

    // date = this.com.date
    constructor(private userService: UserService,
                private sanitization: DomSanitizer) {
    }

    ngOnInit() {
        this.date = (this.com.date as unknown as string).split('T')[0];
        this.heure = (this.com.date as unknown as string).split('T')[1].split('.')[0];
        this.userService.getUser(this.com.id_user)
            .subscribe(
                data => {
                    this.login_user = data.username;
                    this.avatar_user = this.sanitization.bypassSecurityTrustUrl(data.picture);
                },
                error => {
                    console.log('get user error = ', error);
                });
    }

}
