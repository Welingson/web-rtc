import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
  },
  field: {
    marginBottom: '.5rem',
    flexGrow: 1,
  },
  call: {
    height: '2.5rem',
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottom: '1px solid rgb(135, 135, 135)',

    '&:hover': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
    },
  },

  makeCall:{
    backgroundColor: '#43A047',
    borderRadius: 5,
    border: 'unset',
    fontSize: '20px',
    padding: '15px',
    width: '500px',
    color: 'white',
    fontWeight: 'bold',
    marginBottom: '10px'

  },

  actions: {
    margin: '0 .5rem .5rem .5rem',
    width: 'calc(100% - 1rem)',

    '& > *': {
      flexGrow: 1,
    },
  },

  iconAnswer: {
    color: '#3498db',
  },
  iconReject: {
    color: '#e74c3c',
  },
}));

export { useStyles };
