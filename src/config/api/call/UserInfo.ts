import axios from 'axios';

const BASE_URL: string = 'https://portalantares.braztele.com.br:8597/sipconn/cliente/candidato';

class UserInfo {
  static async register(data: any) {
    const res = await axios.post(`${BASE_URL}`, data)

    return res.data[0];
  }

  static async getDestiny(data: any) {
    const res = await axios.post(`${BASE_URL}`, data)

    return res.data[0].destino;

  }
}

export default UserInfo;
