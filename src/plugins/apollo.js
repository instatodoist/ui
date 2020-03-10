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
const errorLink = onError(({ graphQLErrors }) => {
  const { message, status, code } = graphQLErrors[0];
  // Checking Error codes
  if (status && code !== 'ValidationError') {
    switch (status) {
    case 401:
      localStorage.clear();
      window.location.href = '/login';
      break;
    default:
    }
  }
  // parsing error message
  let msg = message.match(/\[(.*?)\]/)[1] || 'Something went wrong';
  msg = msg.replace(/"/g, '');
  msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  Vue.prototype.$toast.error(msg);
});

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    }
  }
});

// Install the Vue plugin
Vue.use(VueApollo);

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});
