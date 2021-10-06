import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    flexGrow: 1,
    textAlign: 'left',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));
