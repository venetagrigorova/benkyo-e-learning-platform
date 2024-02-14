import {
  Box,
  makeStyles,
  Paper,
  Typography,
  withStyles,
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useState } from 'react';
import mainThemeEnum from '../../../themes/main.theme.enum';
import FormError from '../../Errors/FormError';
import formatUserConnectError from './formatUserConnectError';
import Login from './Login';
import Register from './Register';
import userConnectStyles from './styles/userConnectStyles';
import SuccessConnect from './SuccessConnect';

const useStyles = makeStyles({
  registrationPanel: userConnectStyles.registrationPanel,
  toggleButton: userConnectStyles.toggleButton,
  toggleGroup: {
    cursor: 'default',
  },
});

const StyledToggleButton = withStyles((theme) => ({
  root: {
    '&$selected': {
      backgroundColor: theme.palette.primary.main,
      border: mainThemeEnum.border.medium,
      color: theme.palette.text.primary,

      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        cursor: 'default',
      },
      transition: 'boxShadow 0s',
    },
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
    },
  },

  selected: {
    backgroundColor: theme.palette.primary.main,
  },
}))(ToggleButton);

const UserConnect = () => {
  const classes = useStyles();
  const [isErrorSubmit, setErrorSubmit] = useState(false);
  const [isSuccessSubmit, setSuccessSubmit] = useState(false);
  const [errorData, setErrorData] = useState({});
  const [componentName, setComponent] = useState('login');

  const handleToggle = (event, newComponent) => {
    if (newComponent !== null) {
      setErrorSubmit(false);
      setSuccessSubmit(false);
      setComponent(newComponent);
    }
  };

  if (componentName === 'register' && isSuccessSubmit) {
    return <SuccessConnect componentName={componentName} />;
  }

  return (
    <Paper className={classes.registrationPanel} elevation={0}>
      <Box display='flex' justifyContent='flex-end'>
        <ToggleButtonGroup
          value={componentName}
          exclusive
          onChange={handleToggle}
          className={classes.toggleGroup}
        >
          <StyledToggleButton value='register' className={classes.toggleButton}>
            <Typography>new recruit</Typography>
          </StyledToggleButton>
          <StyledToggleButton value='login' className={classes.toggleButton}>
            <Typography>veteran</Typography>
          </StyledToggleButton>
        </ToggleButtonGroup>
      </Box>

      {componentName === 'register' ? (
        <Register
          setErrorSubmit={setErrorSubmit}
          setErrorData={setErrorData}
          setSuccessSubmit={setSuccessSubmit}
        />
      ) : (
        <Login
          setErrorSubmit={setErrorSubmit}
          setErrorData={setErrorData}
          setSuccessSubmit={setSuccessSubmit}
        />
      )}
      {isErrorSubmit && (
        <FormError errorMessage={formatUserConnectError(errorData)} />
      )}
    </Paper>
  );
};

export default UserConnect;
