import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService, AuthenticationService} from '../_services';

@Component({
    selector: 'form-logs',
    templateUrl: './form-logs.component.html',
    styleUrls: ['./form-logs.component.scss']
})
export class FormLogsComponent implements OnInit {
    ModifyForm: FormGroup;
    returnUrl: string;
    submitted = false;
    loading = false;
    error = '';

    @Input() username: string;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private userService: UserService,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        this.ModifyForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            password2: ['', Validators.required]
        });
        this.returnUrl = 'settings';
    }


    get f() {
        return this.ModifyForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.ModifyForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.modifyLog(this.f.username.value, this.f.password.value, this.f.password2.value, this.username)
            .subscribe(
                data => {
                    this.authenticationService.logout();

                },
                error => {
                    this.error = error.error;
                    this.loading = false;
                });
    }

}

