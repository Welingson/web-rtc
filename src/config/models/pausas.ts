import { createModel } from '@rematch/core';

import { listaPausas, pausa, agenteLivre } from '../api/pausas';

type PausasType = {
  DESCRICAO: string;
  ID_PAUSA: number;
  MOTIVO_PAUSA: string;
};

interface IPausas {
  listaPausas: Array<PausasType>;
  agenteEmPausa: string;
}

export const pausas = createModel()({
  state: {
    listaPausas: [],
    agenteEmPausa: '',
  } as IPausas,
  reducers: {
    fetchPausas(state, payload) {
      return { ...state, listaPausas: payload };
    },
    agentOnBreak(state, payload) {
      return { ...state, agenteEmPausa: payload };
    },
  },

  effects: (dispatch) => ({
    async fetchPausasAsync(agente: string) {
      const res = await listaPausas(agente);
      dispatch.pausas.fetchPausas(res);
    },

    async pausaAsync(data: { codigo: number; agente: string }) {
      const res = await pausa(data);
      dispatch.pausas.agentOnBreak(res);
    },

    async agenteLivreAsync(agente: string) {
      await agenteLivre(agente);
      dispatch.pausas.agentOnBreak('');
    },
  }),
});
