import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Dragon } from '@app/models';

@Injectable({ providedIn: 'root' })
export class DragonService {

    constructor(
        private http: HttpClient
    ) {
    }

    getAll() {
        return this.http.get<Dragon[]>(`${environment.apiUrl}/dragon`);
    }
    
    create(dragon: Dragon) {
        return this.http.post(`${environment.apiUrl}/dragon`, dragon);
    }

    getById(id: string) {
        return this.http.get<Dragon>(`${environment.apiUrl}/dragon/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/dragon/${id}`, params)
            .pipe(map(x => {
                
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/dragon/${id}`)
            .pipe(map(x => {
                return x;
            }));
    }
}