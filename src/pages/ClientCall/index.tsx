import { useCallback, useEffect, useRef, useState } from 'react';

import { useHistory, useParams } from 'react-router';

import { useSelector } from 'react-redux';

import toast, { Toaster } from 'react-hot-toast';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';

import { store, RootState } from '../../config/store';

import ReactLoading from 'react-loading';

import { Checkbox as MUICheckbox } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';

import { TextField } from 'unform-material-ui';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import JSipClass from '../../JSSIP/Class';
import { registerRamal } from '../../JSSIP';
import { setCallbackEventCode } from '../../JSSIP/Events';

import { useStyles } from './styles';

import codes from '../../utils/sipCode';

import { UserData } from '../../config/models/user';
import { ClientData } from '../../config/models/client';

import UserInfo from '../../config/api/call/UserInfo';

const ClientCallForm = () => {
  const [codeEvent, setCodeEvent] = useState(0);
  const [attendant, setAttendant] = useState<boolean>();
  const [remember, setRemember] = useState<boolean>();
  const [smsToken, setToken] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('Aguarde...');

  const { id }: { id: string } = useParams();

  //CLIENT INFO

  // const [clientData, setClientData] = useState<ClientData>();

  const [userData, setUserData] = useState<UserData>();

  const { dispatch } = store;

  const classes = useStyles();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);

  const schema = Yup.object().shape({


    //client info
    nome: Yup.string().required('Nome é obrigatório'),
    ddd: Yup.string().required('DDD é obrigatório'),
    telefone: Yup.string().required('Telefone é obrigatório'),

  });

  // const user = useSelector((state: RootState) => state.User.user);
  const userInfo = useSelector((state: RootState) => state.User.data);
  // const token = useSelector((state: RootState) => state.Token.authToken);

  const loadToken = useCallback(async () => {
    const data = {
      username: userData?.attendantName,
      password: userData?.attendantPassword,
    };
    try {
      //@ts-ignore
      await dispatch.Token.saveAuthTokenAsync(data);
    } catch (error) {
      setOpen(false);
      setCodeEvent(400);
    }
  }, [dispatch.Token, userData]);

  useEffect(() => {
    setCallbackEventCode(setCodeEvent);
    if (userInfo && Object.entries(userInfo).length > 0) {
      formRef?.current?.setData({
        ramal: userInfo.ramal,
        displayName: userInfo.displayName,
        ramalPassword: userInfo.ramalPassword,
        attendantName: userInfo.attendantName,
        attendantPassword: userInfo.attendantPassword,
      });

      setAttendant(userInfo.attendantCheck);
      setRemember(userInfo.remember);
      setUserData(userInfo);
    }
  }, [userInfo]);

  useEffect(() => {
    if (codeEvent === 200) {
      setOpen(true);
      if (attendant) {
        setMessage('Carregando token...');
        setTimeout(() => {
          loadToken();
        }, 2000);
      } else {
        dispatch.User.setSimpleUserAsync('simpleUser');

        history.push('/call');
      }
    } else if (codeEvent !== 0) {
      setOpen(false);
      const found = codes.find((code) => code.code === codeEvent);
      toast.error(`${found?.code}: ${found?.message}`);
      setCodeEvent(0);
    }
  }, [
    history,
    userData,
    codeEvent,
    loadToken,
    dispatch.User,
    attendant,
    remember,
  ]);

  useEffect(() => {
    if (smsToken) {
      history.push('/sms-token');
    }
  })

  const handleCloseBackdrop = () => {
    setOpen(false);
  };

  const handleRegister = useCallback(
    async (data: ClientData) => {

      try {

        formRef?.current?.setErrors({});
        await schema.validate(data, {
          abortEarly: false,
        });

        data.link = document.referrer + "cliente/" + id;

        let clientInfoCall = await UserInfo.register(data);

        if (clientInfoCall.resultado == 'OK') {
          localStorage.setItem('clickToCallDestiny', clientInfoCall.destino);

          if (!("Token" === clientInfoCall.senha)) {
            if (JSipClass.ua) {
              setMessage('Enviando informações...');
              setOpen(!open);
              setTimeout(() => {
                setCodeEvent(200);
              }, 1000);
            } else if (Object.entries(data).length > 0) {
              setOpen(!open);
              setMessage('Enviando informações...');
              setTimeout(() => {
                registerRamal(clientInfoCall.senha, clientInfoCall.ramal, clientInfoCall.ramal);
              }, 1000);
            }
          } else {
            localStorage.setItem('clickToCallRamal', clientInfoCall.ramal);
            setToken(true);
          }
        }

      } catch (err) {
        const validationErrors = {};
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach((error) => {
            //@ts-ignore
            validationErrors[error?.path] = error.message;
          });
          formRef?.current?.setErrors(validationErrors);
        }
      }
    },
    [dispatch.User, open, schema],
  );

  return (
    <>
      <Toaster />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper className={classes.paper} elevation={24}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" align='center'>
            Precisamos de algumas informações
          </Typography>
          <Form
            ref={formRef}
            className={classes.form}
            onSubmit={handleRegister}
          >
            <TextField
              name="nome"
              variant="outlined"
              size="small"
              fullWidth
              label="Nome"
              margin="dense"
              onChange={() => {
                formRef?.current?.setFieldError('displayName', '');
              }}
            />
            <TextField
              name="ddd"
              variant="outlined"
              size="small"
              fullWidth
              label="DDD"
              margin="dense"
              onChange={() => {
                formRef?.current?.setFieldError('ramal', '');
              }}
            />
            <TextField
              name="telefone"
              variant="outlined"
              size="small"
              fullWidth
              label="Telefone"
              margin="dense"
              type="text"
              onChange={() => {
                formRef?.current?.setFieldError('ramalPassword', '');
              }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              type="submit"
            >
              Enviar
            </Button>
          </Form>
        </Paper>
        <Backdrop
          className={classes.backdrop}
          open={open}
          onClick={handleCloseBackdrop}
        >
          <Box className={classes.message}>
            <ReactLoading type="bars" color="#FFF" height={'8%'} width={'8%'} />
            &nbsp; &nbsp;
            <Typography align="center" variant="h6">
              {message}
            </Typography>
          </Box>
        </Backdrop>
      </Container>
    </>
  );
};

export default ClientCallForm;
