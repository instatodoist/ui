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

  yesterdayDate() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }
}
