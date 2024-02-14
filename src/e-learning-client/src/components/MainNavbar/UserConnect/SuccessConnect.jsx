import { makeStyles, Paper, Typography } from '@material-ui/core';
import mainTheme from '../../../themes/main.theme';
import userConnectStyles from './styles/userConnectStyles';

const useStyles = makeStyles({
  registrationPanel: { ...userConnectStyles.registrationPanel },
  paragraphSuccess: {
    marginBottom: mainTheme.spacing(6),
    marginTop: mainTheme.spacing(3),
    textAlign: 'center',
  },
});

const SuccessConnect = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.registrationPanel} elevation={0}>
      <Typography variant={'h4'} className={classes.paragraphSuccess}>
        Welcome to the Benkyō community!
      </Typography>
      <Typography variant={'subtitle1'} className={classes.paragraphSuccess}>
        We're glad to see you back. <br />
        Give us a short instant, we'll close this window for you.
      </Typography>
    </Paper>
  );
};

export default SuccessConnect;
