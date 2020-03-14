import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models'
import { LOGIN_QUERY } from '../gql/auth.gql';
import {Apollo} from 'apollo-angular';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})

export class AuthService {
    API_URL = environment.API_URL;
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'accept': 'application/json'
        })
    };
    constructor(private apollo: Apollo) { }
    signIn(_data: UserModel.UserType) {
        return this.apollo
      .watchQuery({
          query: LOGIN_QUERY,
          variables: {
            input: _data,
          },
        })
        .valueChanges.pipe(map(({data}) => {
            return data
        }));
    }
}