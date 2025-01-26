
import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import MainPage from './pages/MainPage';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import History from './pages/History';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/history" component={History} />
          <Route exact path="/home" component={MainPage} />
          <Route exact path="/settings" component={Settings} />
          <Route exact path={['', '/']}>
            <Redirect to="/home" />
          </Route><Route path="*">
            <NotFound /> 
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}
