import Vue from 'vue';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo';
import { setContext } from 'apollo-link-context';

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_GRAPHQL_ENDPOINT,
});

const accessToken = localStorage.getItem('token');
// Create a new Middleware Link using setContext
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

// Error Handling
// eslint-disable-next-line consistent-return
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // eslint-disable-next-line array-callback-return
    graphQLErrors.map(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
    });
  }
  if (networkError) {
    const key = 'statusCode';
    const statusCode = networkError[key] || null;
    switch (statusCode) {
    case 401:
      localStorage.clear();
      window.location.href = '/login';
      break;
    default:
      return true;
    }
  }
  if (graphQLErrors) console.log(graphQLErrors[0].message);
  let testMessage = graphQLErrors[0].message;
  if (testMessage.includes('[')) {
    const message = testMessage.substring(
      testMessage.lastIndexOf('[') + 1,
      testMessage.lastIndexOf(']'),
    ).replace(/"/g, '');
    testMessage = message.charAt(0).toUpperCase() + message.slice(1);
  }

  Vue.prototype.$toast.error(testMessage);
});

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

// Install the Vue plugin
Vue.use(VueApollo);

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});
