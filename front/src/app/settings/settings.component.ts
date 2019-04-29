import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../_services';
import {DomSanitizer, SafeHtml, SafeUrl, SafeStyle} from '@angular/platform-browser';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    loading = false;
    submitted = false;
    compte_extene = false;
    ext = "";

    @Input() lastname: string;
    @Input() firstname: string;
    @Input() username: string;
    @Input() mail: string;
    @Input() language: string;
    @Input() avatar: SafeUrl;

    constructor(private formBuilder: FormBuilder,
                private userService: UserService,
                private sanitization: DomSanitizer) {
    }

    ngOnInit() {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        this.username = user.username;
        this.userService.getUser(user.id)
            .subscribe(
                data => {
                    this.firstname = data.firstname;
                    this.lastname = data.lastname;
                    this.mail = data.email;
                    this.language = data.language;
                    this.avatar = this.sanitization.bypassSecurityTrustUrl(data.picture);
                    if (data.googleId || data.fortytwoId || data.githubId) {
                        this.compte_extene = true;
                        if (data.googleId)
                            this.ext = "Google";
                        if (data.fortytwoId)
                            this.ext = "intra 42";
                        if (data.githubId)
                            this.ext = "Git Hub";
                    }
                },
                error => {
                    console.log("get user error = ", error);
                });
    }

}
