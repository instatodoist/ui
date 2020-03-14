import { Injectable } from '@angular/core';
import { LsService } from './../../service/ls.service';
import { environment } from '../../../environments/environment';
import { UserModel } from '../../models';
import { LOGIN_QUERY, REGISTER_MUTATION } from '../../gql/auth.gql';
import {Apollo} from 'apollo-angular';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authKey = 'isLoggedIn';
  API_URL = environment.API_URL;

  constructor(private lsService: LsService, private apollo: Apollo) { }

  login() {
    return this.lsService.getValue(this.authKey) ? true : false;
  }

  logout() {
    return this.lsService.deleteValue(this.authKey);
  }

  signIn(postData: UserModel.UserType) {
    return this.apollo
      .watchQuery({
          query: LOGIN_QUERY,
          variables: {
            input: postData,
          },
        })
        .valueChanges.pipe(map(({data}) => {
            return data;
        }));
  }

  register(postData: UserModel.UserType): Observable<UserModel.RegisterResponse> {
    return this.apollo
      .mutate({
        mutation: REGISTER_MUTATION,
        variables: postData
      })
      .pipe(map(({data}: any ) => {
        return data.register;
      }));
  }
}
