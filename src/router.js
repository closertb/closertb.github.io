import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Layout from './Layout';

export default function () {
  return (
    <Router>
      <Route component={Layout} />
    </Router>
  );
}
