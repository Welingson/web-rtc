import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(15),
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  message: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },

  avatarError: {
    margin: theme.spacing(1),
    backgroundColor: '#ff0000',
  },

  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  separator: {
    fontSize: '14px',
    color: '#a8a8b3',

    margin: '10px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&:before': {
      content: "''",
      flex: 1,
      height: '1px',
      background: ' #a8a8b3',
      marginRight: '16px',
    },

    '&:after': {
      content: "''",
      flex: 1,
      height: '1px',
      background: '#a8a8b3',
      marginLeft: '16px',
    },
  },

  checkOptions: {
    display: 'flex',
    justifyContent: 'space-around',
  },
}));
