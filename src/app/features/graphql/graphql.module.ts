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
import { LsService } from '../../service/ls.service';
import { ApolloClient } from 'apollo-client';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
    const errorLink = onError((
      {
        graphQLErrors,
        networkError,
        // response,
        // operation
      }
    ): any => {

      try {
        // parse Network Errors
        if (typeof (networkError) !== 'undefined') {
          const msg = utilityService.parseErrorMessage(networkError);
          if (msg === 'LOGOUT') {
            localStorage.clear();
            window.location.href = '/auth/login';
            throw msg;
          }
          throw new Error(msg);
        }
        // parse GraphQl specific Errorxs
        if (typeof (Array.isArray(graphQLErrors) && graphQLErrors.length)) {
          const message = utilityService.parseGraphQlError(graphQLErrors);
          throw message;
        }
      } catch (error) {
        utilityService.toastrError(error);
        return throwError(new Error(error));
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
