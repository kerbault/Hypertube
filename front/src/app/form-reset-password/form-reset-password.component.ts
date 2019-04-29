import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../_services';

@Component({
    selector: 'form-reset-password',
    templateUrl: './form-reset-password.component.html',
    styleUrls: ['./form-reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    ForgetForm: FormGroup;
    returnUrl: string;
    submitted = false;
    loading = false;
    error = '';

    @Input() email: string;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private userService: UserService) {
    }

    ngOnInit() {
        this.ForgetForm = this.formBuilder.group({
            mail: ['', Validators.required]
        });
        this.returnUrl = 'reset_password';
    }


    get f() {
        return this.ForgetForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.ForgetForm.invalid) {
            return;
        }
        this.userService.ForgetPass(this.f.mail.value)
            .subscribe(
                data => {
                    this.router.navigate(['/login']);
                },
                error => {
                    this.error = error.error;
                    this.loading = false;
                });
        this.loading = true;

    }

}

