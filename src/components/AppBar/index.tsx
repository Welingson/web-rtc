import React, { useCallback } from 'react';

import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import MuiAppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';

import { store, RootState } from '../../config/store';

import { unRegister } from '../../JSSIP';

import logoImg from '../../assets/brazteleSvg.svg';

import { useStyles } from './styles';

interface AppBarProps {
  toggleDrawer?: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ toggleDrawer }) => {
  const classes = useStyles();

  const { dispatch } = store;
  const history = useHistory();

  const data = useSelector((state: RootState) => state.User.data);
  const user = useSelector((state: RootState) => state.User.user);
  const token = useSelector((state: RootState) => state.Token.authToken);
  
  const handleLogout = useCallback(async () => {
    unRegister();
    
    if(user === 'simpleUser') {

      dispatch.User.resetUser();
      history.push('/');

    } else if(user === 'OK') {

      if(token) {
        //@ts-ignore
        await dispatch.User.doLogoutAsync(data?.attendantName);
      }

      dispatch.User.resetUser();
      dispatch.Token.resetAuthToken();
      history.push('/');
      
    }    
  }, [data?.attendantName, dispatch.Token, dispatch.User, history, token]);

  return (
    <MuiAppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        {toggleDrawer && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" noWrap className={classes.title}>
          Antares
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Sair
        </Button>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
