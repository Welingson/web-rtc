import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  toolbar: {
    ...theme.mixins.toolbar,
    marginBottom: theme.spacing(8)
  }
}));
