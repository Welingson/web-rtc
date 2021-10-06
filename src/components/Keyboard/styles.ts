import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  keyboard: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  keyboardRow: {
    '& > *': {
      flex: '1 0 0',
    },
    '&:not(:last-child)': {
      '& > *': {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomStyle: 'none',
      },
    },
    '&:not(:first-child)': {
      '& > *': {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      },
    },
  },
});

export { useStyles };
