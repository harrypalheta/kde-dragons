import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { DragonService, NotificationService } from '@app/services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private dragonService: DragonService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            type: ['', Validators.required],
            history: [''],
        });

        if (!this.isAddMode) {
            this.dragonService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.f.id.setValue(this.id);
                    this.f.name.setValue(x.name);
                    this.f.type.setValue(x.type);
                    this.f.history.setValue(x.history);
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.notificationService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createDragon();
        } else {
            this.updateDragon();
        }
    }

    private createDragon() {
        this.dragonService.create(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.notificationService.success('Dragon added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.notificationService.error(error);
                    this.loading = false;
                });
    }

    private updateDragon() {
        this.dragonService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.notificationService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.notificationService.error(error);
                    this.loading = false;
                });
    }
}