import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  todayDate() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    today = new Date (yyyy + '-' + mm + '-' + dd);
    return today;
  }

  todayDisplayDate() {
    const today = new Date();
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
      dd = `0${dd}`;
    }

    if (mm < 10) {
      mm = `0${mm}`;
    }
    return `${yyyy}-${mm}-${dd}`;
  }

  yesterdayDate() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }
}
