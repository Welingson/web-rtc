import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { getPersistor } from '@rematch/persist';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { store } from '../src/config/store';

import reportWebVitals from './reportWebVitals';

import App from './App';

import './index.css';

ReactDOM.render(
  <PersistGate persistor={getPersistor()}>
    <Provider store={store}>
      <App />
    </Provider>
  </PersistGate>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
