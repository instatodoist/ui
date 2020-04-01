import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloModule, APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { environment } from '../../../environments/environment';
import { UtilityService } from '../../service/utility.service';
import {LsService} from '../../service/ls.service';
import { ApolloClient } from 'apollo-client';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphqlModule {
  constructor(apollo: Apollo, httpLink: HttpLink, utilityService: UtilityService, lsService: LsService) {

    const httpLink2 = httpLink.create({
      uri: environment.API_URL,
    });

    const accessToken = lsService.getValue('__token');
    // auth link
    const authLink = setContext((_, { headers }) =>
      // get the authentication token from local storage if it exists
      // return the headers to the context so httpLink can read them
      // eslint-disable-next-line implicit-arrow-linebreak
      ({
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      }));
    // error link
    const errorLink = onError(({ graphQLErrors, networkError, response, operation }) => {
      if (typeof (networkError) !== 'undefined') {
        const { error }: any = networkError;
        const errors = error.errors[0];
        const { status, code, message } = errors;
        // Checking Error codes
        if (status && code !== 'ValidationError') {
          switch (status) {
            case 401:
              localStorage.clear();
              window.location.href = '/';
              break;
            default:
          }
        }
        // parsing error message
        let msg = message;
        if (message.match(/\[(.*?)\]/)) {
          msg = message.match(/\[(.*?)\]/)[1] || 'Something went wrong';
          msg = msg.replace(/"/g, '');
          msg = msg.charAt(0).toUpperCase() + msg.slice(1);
        }
        utilityService.toastrError(msg);
      }
    });
    const httpLinkWithErrorHandling = ApolloLink.from([
      errorLink,
      authLink,
      httpLink2
    ]);
    apollo.create({
      link: httpLinkWithErrorHandling,
      cache: new InMemoryCache(),
      connectToDevTools: true,
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all'
        }
      }
    });
  }
}
