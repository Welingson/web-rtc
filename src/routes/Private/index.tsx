import React from 'react';

import { Route, Redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { RootState } from '../../config/store';

const PrivateRoute = (props: any) => {
  const user = useSelector((state: RootState) => state.User.user);

  const isLogged = !!Object.entries(user).length;
  return isLogged ? <Route {...props} /> : <Redirect to="/" />;
};

export default PrivateRoute;
