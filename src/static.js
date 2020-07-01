import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { StaticRouter as Router, Route } from 'react-router-dom';
import { TOKEN } from './configs/constants';
import { unCompileParam } from './configs/utils';
import graphqlUri from './configs/server';
import { resolvers, typeDefs, defaults } from './client/index';
import Layout from './Layout';

const token = unCompileParam(TOKEN);

// Initialize
const cache = new InMemoryCache();

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    Authorization: `bearer ${token}`,
  }
}));
const httpLink = new HttpLink({
  uri: process.env.NODE_ENV === 'production' ? 'http://127.0.0.1:3000/arcticle/graphql' : graphqlUri,
  batchInterval: 10,
  fetch,
  opts: {
    credentials: 'cross-origin',
  },
});

export default function createInstance(url) {
  const client = new ApolloClient({
    clientState: { resolvers, defaults, cache, typeDefs },
    ssrMode: true,
    cache, // 本地数据存储, 暂时用不上
    link: authLink.concat(httpLink),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      }
    }
  });

  const App = (
    <ApolloProvider client={client}>
      <Router location={url}>
        <Route component={Layout} />
      </Router>
    </ApolloProvider>
  );

  return {
    client,
    App
  };
}
