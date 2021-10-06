import { http } from '../axios';

export const getToken = async (data: {
  username: string;
  password: string;
}) => {
  const params = new URLSearchParams();
  params.append('username', data.username);
  params.append('password', data.password);
  params.append('grant_type', 'password');

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  const res = await http.post('/token', params, config);

  return res.data;
};
