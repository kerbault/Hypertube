import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from '../_services';
import {DomSanitizer, SafeHtml, SafeUrl, SafeStyle} from '@angular/platform-browser';

@Component({
    templateUrl: './profil-other.component.html',
    styleUrls: ['./profil-other.component.scss']
})
export class ProfilComponent implements OnInit {
    @Input() id: string;
    firstname: string;
    language: string;
    lastname: string;
    picture: SafeUrl;
    username: string;

    constructor(private userService: UserService,
                private route: ActivatedRoute,
                private sanitization: DomSanitizer) {
    }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get("id");

        this.userService.getUser(this.id)
            .subscribe(
                data => {
                    this.firstname = data.firstname;
                    this.language = data.language;
                    this.lastname = data.lastname;
                    this.picture = data.picture;
                    this.username = data.username;
                    this.picture = this.sanitization.bypassSecurityTrustUrl(data.picture);
                },
                error => {
                    console.log("get user error = ", error);
                });
    }

}
