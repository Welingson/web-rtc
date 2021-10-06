import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
    padding: '1rem 2rem',
    color: 'white',
    borderRadius: '4px',    
  },
  number: {
    fontWeight: 'bold',
    fontSize: '1.5rem'
  },
  cardTitle: {
    fontSize: '1.1rem'
  },
  icon: {
    fontSize: '2rem'
  }
}));
