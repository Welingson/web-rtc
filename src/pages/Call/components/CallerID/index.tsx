import React from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import CallIcon from '@material-ui/icons/Call';
import CallEndIcon from '@material-ui/icons/CallEnd';

import { useStyles } from './styles';

interface CallerIDProps {
  text: string;
  background: "red" | "green";
}

const CallerID: React.FC<CallerIDProps> = ({ text, background }) => {

  const classes = useStyles();

  const handleBackground = () => {
    let color = '#87ff8f';
    if(background === "red") {
      color = '#fc5656';
    }

    return color;    
  }

  return (
    <Paper className={classes.card} style={{ backgroundColor: handleBackground() }}>
      <div>
        {background !== "red" ? (<CallIcon className={classes.icon} />) : (<CallEndIcon className={classes.icon}/>)}
      </div>
      <div>
        <Typography className={classes.cardTitle}>
          {text}         
        </Typography>
      </div>
      {/* <div>
        <Typography className={classes.number}>{phone}</Typography>
      </div> */}
    </Paper>
  );
};

export default CallerID;
