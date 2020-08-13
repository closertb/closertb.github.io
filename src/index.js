import React from 'react';
import { hydrate as render } from 'react-dom';
import { HttpLink, ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { TOKEN } from './configs/constants';
import { unCompileParam } from './configs/utils';
import graphqlUri from './configs/server';
import { resolvers, typeDefs, defaults } from './client/index';
import Layout from './Layout';
import './style/index.less';
import './style/markdown.css';

const token = unCompileParam(TOKEN);

// Initialize
const cache = new InMemoryCache().restore(window.__APOLLO_STATE__);

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    Authorization: `bearer ${token}`,
  }
}));
const httpLink = new HttpLink({
  uri: graphqlUri,
  batchInterval: 10,
  opts: {
    credentials: 'cross-origin',
  },
});
const client = new ApolloClient({
  clientState: { resolvers, defaults, cache, typeDefs },
  cache, // 本地数据存储, 暂时用不上
  link: authLink.concat(httpLink)
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Route component={Layout} />
      </Router>
    </ApolloProvider>
  );
}

render((
  <App />
), document.getElementById('app'));
