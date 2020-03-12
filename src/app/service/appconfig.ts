import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class AppConfig {
    appData: BehaviorSubject<any>;
    constructor() {
        this.appData = new BehaviorSubject({});
    }
    updateAppData(data) {
        this.appData.next(data);
    }
}