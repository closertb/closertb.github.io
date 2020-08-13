import React from 'react';
import { HttpLink, ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import fetch from 'node-fetch';
import { StaticRouter as Router, Route } from 'react-router-dom';
import { TOKEN } from './configs/constants';
import { unCompileParam } from './configs/utils';
import graphqlUri from './configs/server';
import { resolvers, typeDefs, defaults } from './client/index';
import Layout from './Layout';

const token = unCompileParam(TOKEN);

// 这里保证每次刷新，服务端缓存都能刷新；
const cache = new InMemoryCache({}).restore({});

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
    queryDeduplication: false,
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
