import { createModel } from '@rematch/core';

import { heartBeat, agentState, integration } from './../api/agente';

type Agent = {
  ESTADO: number;
  TEMPO: string;
  DESCRICAO: string;
  CAPTION_PAUSA: string;
  MOTIVO_PAUSA: number;
  TEMPORESTANTE: number;
};

type Integration = {
  IntegrationType: string;
  ScreenPopup: string;
};
interface IAgent {
  agentState: Agent;
  integrationData: Integration;
}

export const agente = createModel()({
  state: {
    agentState: {},
    integrationData: {},
  } as IAgent,
  reducers: {
    setAgentState(state, payload) {
      return { ...state, agentState: payload };
    },
    setIntegrationData(state, payload) {
      return { ...state, integrationData: payload };
    },
  },
  effects: (dispatch) => ({
    async heartBeatAsync(data: { agente: string; ipdesktop: string }) {
      await heartBeat(data);
    },

    async agentStateAsync(agente: string) {
      const res = await agentState(agente);
      dispatch.agente.setAgentState(res);
    },

    async integrationAsync(agente: string) {
      const res = await integration(agente);
      dispatch.agente.setIntegrationData(res);
    },
  }),
});
