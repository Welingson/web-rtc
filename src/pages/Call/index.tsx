import { useState, useEffect } from 'react';

import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

import toast, { Toaster } from 'react-hot-toast';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

import AppBar from '../../components/AppBar';
import CallerID from './components/CallerID';
import Keyboard from '../../components/Keyboard';
import PhoneCall from '../../components/PhoneCall';

import { RootState, store } from '../../config/store';

import JSipClass from '../../JSSIP/Class';

import { useStyles } from './style';

const Call = () => {
  const [phone, setPhone] = useState('');

  const inCall =  useSelector((state: RootState) => state.actions.inCall);
  const message = useSelector((state: RootState) => state.actions.message);

  const callEnded = useSelector((state: RootState) => state.actions.callEnded);
  const failToCall = useSelector((state: RootState) => state.actions.failToCall);

  const classes = useStyles();
  const history = useHistory();

  const { dispatch } = store;

  useEffect(() => {
    if (!JSipClass.ua) {
      toast.error('Por favor, realize o login novamente.');
      dispatch.User.resetUser();
      dispatch.Token.resetAuthToken();
      history.push('/');
    }
  }, [dispatch.Token, dispatch.User, history]);

  useEffect(() => {
    setTimeout(() => {
      dispatch.actions.setCallEndedAsync(false);
    }, 4500);
  }, [callEnded]);

  return (
    <>
      <Box className={classes.toolbar} />
      <Container fixed maxWidth="sm">
        <Paper style={{ padding: '.5rem 0' }}>
          <Box display="flex" flexDirection="column">
            <PhoneCall phone={phone} setPhone={setPhone} />
          </Box>
        </Paper>

        { inCall && !failToCall && ( <CallerID text={message} background="green"/> )}        
        { failToCall && ( <CallerID text={message} background="red"/> )}   
        { callEnded && !inCall && !failToCall && ( <CallerID text={message} background="red"/> )}

      </Container>
    </>
  );
};

export default Call;
