import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import Browser from './containers/Browser';

export default (
  <App>
    <Switch>
      <Route path="/" component={Browser} />
    </Switch>
  </App>
);
