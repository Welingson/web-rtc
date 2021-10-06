import { createModel } from '@rematch/core';

import { loginAgente, logoutAgente, loginProps } from '../api/user';

export interface ClientData {
  destino: string;
  link: string;
  ramal: string;
  tokenSMS: string;

}
interface IClient {
  client: {};
  data: ClientData;
}

export const Client = createModel()({
  state: {
    client: {},
    data: {},
  } as IClient,
  reducers: {
    setSimpleClient(state, payload) {
      return { ...state, Client: payload };
    },
    resetClient(state) {
      return { ...state, Client: {} };
    },
  },

  effects: (dispatch) => ({
    async setSimpleClientAsync(Client: string) {
      dispatch.Client.setSimpleClient(Client);
    },

    async storeClientDataAsync(data: ClientData) {
      dispatch.Client.storeClientData(data);
    },

    async resetClientAsync() {
      dispatch.Client.resetClient();
    },
  }),
});
