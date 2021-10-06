import React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import JSipClass from '../../JSSIP/Class';
import { sendDTMFTone } from '../../JSSIP';
import { startDtmfTone } from '../../JSSIP/Sounds';

import { useStyles } from './styles';

interface KeyboardProps {
  phone: string;
  setPhone: (phone: string) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ phone, setPhone }) => {
  const classes = useStyles();

  const handleValue = (value: string) => () => {
    if (JSipClass.call && JSipClass.call.isEstablished()) {
      sendDTMFTone(value);
    } else {
      setPhone(`${phone}${value}`);
      startDtmfTone(value);
    }
  };

  return (
    <Box className={classes.keyboard}>
      {[
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ['*', 0, '#'],
      ].map((row, index) => (
        <ButtonGroup key={`keyboard-row-${index}`} className={classes.keyboardRow}>
          {row.map((key) => (
            <Button variant="outlined" key={key} onClick={handleValue(`${key}`)}>
              {key}
            </Button>
          ))}
        </ButtonGroup>
      ))}
    </Box>
  );
};

export default Keyboard;
