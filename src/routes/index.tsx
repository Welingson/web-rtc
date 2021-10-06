import React from 'react';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import PrivateRoute from './Private';

import ClientCallForm from '../pages/ClientCall';
import Call from '../pages/Call';
import SMSToken from '../pages/SMSToken';

export default function Routes() {
  return (
    <Router>
      <Switch>

        <Route exact path="/cliente/:id">
          <ClientCallForm />
        </Route>

        {/*ROTA CASO SEJA NECESSÁRIO UM TOKEN POR SMS (SENHA DO RAMAL) */}
        <Route exact path="/sms-token">
          <SMSToken />
        </Route>

        {/*ROTA APÓS REQUISIÇÃO NA API E AUTENTICAÇÃO*/}
        <PrivateRoute exact path="/call">
          <Call />
        </PrivateRoute>
      </Switch>
    </Router >
  );
}
