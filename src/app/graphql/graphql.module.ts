import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloModule, APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { environment } from '../../environments/environment';
import { UtilityService } from '../service/utility.service';
import { LsService } from '../service/ls.service';
import { AuthService } from '../service/auth/auth.service';
import { ApolloClient } from 'apollo-client';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphqlModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink,
    utilityService: UtilityService,
    lsService: LsService,
    private authService: AuthService,
    private router: Router
  ) {

    const httpLink2 = httpLink.create({
      uri: environment.API_URL
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
          authorization: accessToken ? `Bearer ${accessToken}` : ''
        }
      }));
    // error link
    const errorLink = onError((
      {
        graphQLErrors = null,
        networkError = null
        // response
        // operation
      }
    ): any => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message }) =>
          utilityService.toastrError(message)
        );
        return throwError(graphQLErrors[0]);
      } else if (networkError) {
        this.authService.logout();
        this.router.navigate(['/']);
        return false;
        // const { message } = networkError;
        // utilityService.toastrError(message);
        // return throwError(networkError);
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
