import { createModel } from '@rematch/core';

import { getToken } from '../api/token';

type TokenType = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

interface IToken {
  authToken: TokenType | null;
}

export const Token = createModel()({
  state: {
    authToken: {},
  } as IToken,

  reducers: {
    saveAuthToken(state, payload) {
      return { ...state, authToken: payload };
    },

    resetAuthToken(state) {
      return {
        ...state,
        authToken: null,
      };
    },
  },

  effects: (dispatch) => ({
    async saveAuthTokenAsync(data: { username: string; password: string }) {
      const res = await getToken(data);
      dispatch.Token.saveAuthToken(res);
    },
  }),
});
