import axios from 'axios';

import { store } from '../store';

const getAuthHeaders = (config: any) => {
  const token = store.getState().Token.authToken;
  const newConfig = config;

  if (token) {
    newConfig.headers = {
      ...newConfig.headers,
      authorization: `Bearer ${token.access_token}`,
    };
  }

  return newConfig;
};

const http = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

const httpAuth = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

httpAuth.interceptors.request.use(getAuthHeaders);

export { http, httpAuth };
