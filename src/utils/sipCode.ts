// eslint-disable-next-line import/no-anonymous-default-export
export default [
  { code: 200, message: 'Ok' },
  {
    code: 400,
    message: 'Acesso inválido, as credenciais do usuário não conferem....',
  },
  { code: 401, message: 'Unauthorized.' },
  { code: 480, message: 'Temporarily Unavailable.' },
  { code: 1006, message: 'Websocket connection failed, try again later.' },
];
