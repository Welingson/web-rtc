import { httpAuth } from '../axios';

export interface loginProps {
  agente: string;
  senha: string;
  ramal: string;
  ipdesktop: string;
}

export const loginAgente = async (data: loginProps) => {
  const res = await httpAuth.post('/sipconn/login', data);
  return res.data;
};

export const logoutAgente = async (agente: string) => {
  const data = { agente };
  await httpAuth.post('/sipconn/logoff', data);
};
