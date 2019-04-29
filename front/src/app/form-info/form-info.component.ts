import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../_services';


@Component({
    selector: 'form-info',
    templateUrl: './form-info.component.html',
    styleUrls: ['./form-info.component.scss']
})
export class FormInfoComponent implements OnInit {
    ModifyForm: FormGroup;
    returnUrl: string;
    submitted = false;
    loading = false;
    error = '';

    @Input() lastname: string;
    @Input() firstname: string;
    @Input() mail: string;
    @Input() language: string;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private userService: UserService) {
    }

    ngOnInit() {
        this.ModifyForm = this.formBuilder.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            language: ['', Validators.required],
            mail: ['', Validators.required]
        });
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
        this.userService.modifyInfo(this.f.firstname.value, this.f.lastname.value, this.f.mail.value, this.f.language.value, this.mail)
            .subscribe(
                data => {
                    location.reload();

                },
                error => {
                    this.error = error.error;
                    this.loading = false;
                });
    }


}
