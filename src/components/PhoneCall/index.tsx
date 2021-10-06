import React, { ChangeEvent, useCallback, useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import toast, { Toaster } from 'react-hot-toast';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import PhoneIcon from '@material-ui/icons/Phone';

import { makeCall,answer } from '../../JSSIP';

import { RootState, store } from '../../config/store';

import { setCallbackInCall, setCallbackIncomingCall } from '../../JSSIP/Events';


import { useStyles } from './styles';

interface PhoneCallProps {
  phone: string;
  setPhone: (phone: string) => void;
}

const PhoneCall: React.FC<PhoneCallProps> = ({ phone, setPhone }) => {
  
  const [inCall, setInCall] = useState<boolean>(false);
  const [incomingCall, setIncomingCall] = useState<boolean>(false);

  const [clear, setClear] = useState<NodeJS.Timeout | undefined>();

  const autoAnswer = useSelector(
    (state: RootState) => state.actions.autoAnswer,
  );

  const classes = useStyles();

  useEffect(() => {
    setCallbackInCall(setInCall);
    setCallbackIncomingCall(setIncomingCall);
  }, []);

  useEffect(() => {
    if (incomingCall && autoAnswer) {
      const x = setTimeout(() => {
        if (incomingCall) {
          answer();
        }
      }, 2000);

      setClear(x);
    }
  }, [autoAnswer, incomingCall]);


  const handleMakeCall = useCallback(() => {

    if (localStorage.getItem('clickToCallDestiny')) {
      let destiny = localStorage.getItem('clickToCallDestiny');

      if (destiny) {
        makeCall(destiny)
      } else {
        toast.error('Falha ao realizar ligação');
      }
    } else {
      toast.error('Falha ao realizar ligação');
    }

  }, [phone, setPhone]);

  return (
    <>
      <Box className={classes.container}>
        <Box margin="0 .5rem">

          <Box marginLeft=".5rem">
            <Button
              variant="contained"
              size="small"
              className={classes.makeCall}
              disableElevation
              onClick={handleMakeCall}
            >
              Fale Conosco
              <PhoneIcon />
            </Button>
          </Box>
        </Box>


        <ButtonGroup size="small" disableElevation className={classes.actions}>
        
        </ButtonGroup>
      </Box>
    </>
  );
};

export default PhoneCall;
