import { createModel } from '@rematch/core';

import { loginAgente, logoutAgente, loginProps } from '../api/user';

export interface UserData {
  ramal: string;
  remember: boolean;
  displayName: string;
  ramalPassword: string;
  attendantName?: string;
  attendantCheck?: boolean;
  attendantPassword?: string;
}
interface IUser {
  user: {};
  data: UserData;
}

export const User = createModel()({
  state: {
    user: {},
    data: {},
  } as IUser,
  reducers: {
    setSimpleUser(state, payload) {
      return { ...state, user: payload };
    },
    doLogin(state, payload) {
      return { ...state, user: payload };
    },
    resetUser(state) {
      return { ...state, user: {} };
    },
    storeUserData(state, payload) {
      return { ...state, data: payload };
    },
  },

  effects: (dispatch) => ({
    async setSimpleUserAsync(user: string) {
      dispatch.User.setSimpleUser(user);
    },
    async doLoginAsync(data: loginProps) {
      const res = await loginAgente(data);
      dispatch.User.doLogin(res);
    },

    async doLogoutAsync(agente: string) {
      await logoutAgente(agente);
    },

    async storeUserDataAsync(data: UserData) {
      dispatch.User.storeUserData(data);
    },

    async resetUserAsync() {
      dispatch.User.resetUser();
    },
  }),
});
