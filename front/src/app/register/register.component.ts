import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {Title} from '@angular/platform-browser';

import {UserService} from '../_services';
import {AuthenticationService} from '../_services';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    registerfrom: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    selected = '';
    selectedValue: String[];

    avatars = [
        {
            src: 'assets/default.png'
        },
        {
            src: 'assets/2.png'
        },
        {
            src: 'assets/3.png'
        },
        {
            src: 'assets/4.png'
        },
        {
            src: 'assets/5.png'
        },
        {
            src: 'assets/6.png'
        }
    ];

    constructor(private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private userService: UserService,
                private title: Title) {
        this.title.setTitle("Hypertube - Register");
    }

    ngOnInit() {
        this.registerfrom = this.formBuilder.group({
            username: ['', Validators.required],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            password: ['', Validators.required],
            password2: ['', Validators.required],
            mail: ['', Validators.required]
        });
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    toggleOptions: Array<String> = ["assets/default.png", "assets/2.png", "assets/3.png", "assets/4.png", "assets/5.png", "assets/6.png"];

    selectionChanged(item) {
        this.selected = item.value;
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.registerfrom.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerfrom.invalid) {
            return;
        }

        if (this.selected == "")
            this.selected = 'assets/default.png';

        this.loading = true;

        this.userService.register(this.f.username.value, this.f.firstname.value, this.f.lastname.value, this.f.password.value, this.f.password2.value, this.f.mail.value, this.selected)
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error.error;
                    this.loading = false;
                });
    }
}

