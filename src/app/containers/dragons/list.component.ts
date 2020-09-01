import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { DragonService } from '@app/services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    dragons = null;

    constructor(private dragonService: DragonService) {}

    ngOnInit() {
        this.dragonService.getAll()
            .pipe(first())
            .subscribe(dragons => this.dragons = dragons);
    }

    deleteDragon(id: string) {
        const dragon = this.dragons.find(x => x.id === id);
        dragon.isDeleting = true;
        this.dragonService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.dragons = this.dragons.filter(x => x.id !== id) 
            });
    }
}