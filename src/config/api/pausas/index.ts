import { httpAuth } from '../axios';

export const listaPausas = async (agente: string) => {
  const data = { agente };
  const res = await httpAuth.post('/sipconn/pausas/lista', data);
  return res.data;
};

export const pausa = async (data: { codigo: number; agente?: string }) => {
  const res = await httpAuth.post('/sipconn/pausa/pausa', data);
  return res.data;
};

export const agenteLivre = async (agente: string) => {
  const data = { agente };
  const res = await httpAuth.post('/sipconn/pausa/agente_livre', data);
  return res.data;
};
