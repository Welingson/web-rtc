import { httpAuth } from '../axios';

export const heartBeat = async (data: {
  agente: string;
  ipdesktop: string;
}) => {
  await httpAuth.post('sipconn/Agente/HeartBeat', data);
};

export const agentState = async (agente: string) => {
  const data = { agente };
  const res = await httpAuth.post('/sipconn/softfone/Agente/Estado', data);
  return res.data[0];
};

export const integration = async (agente: string) => {
  try {
    const data = { agente };
    const res = await httpAuth.post('sipconn/softfone/bilhetecontato', data);

    if (res.data.length > 0) {
      return res.data[0];
    } else {
      return {};
    }
  } catch (error) {
    return {};
  }
};
