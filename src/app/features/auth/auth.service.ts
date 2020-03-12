import { Injectable } from '@angular/core';
import { LsService } from './../../service/ls.service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authKey: string = 'isLoggedIn';

  constructor(private lsService: LsService) { }

  login(): boolean {
    this.lsService.getValue(this.authKey)
    return
  }

  logout(): boolean {
    this.lsService.deleteValue(this.authKey)
    return;
  }

}
