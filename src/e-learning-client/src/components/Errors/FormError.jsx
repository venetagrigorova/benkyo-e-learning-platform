import { Box, withStyles, Typography, makeStyles } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import mainTheme from '../../themes/main.theme';

const useStyles = makeStyles({
  errorComponent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: mainTheme.spacing(3),
  },
  errorMessage: {
    color: mainTheme.palette.error.main,
  },
});

const StyledErrorIcon = withStyles({
  root: {
    fontSize: mainTheme.typography.fontSize * 2,
    color: mainTheme.palette.error.main,
    marginBottom: mainTheme.spacing(1),
  },
  colorSecondary: {
    color: mainTheme.palette.error.light,
  },
})(ErrorIcon);

const FormError = ({ errorMessage }) => {
  const classes = useStyles();

  return (
    <Box display='flex' className={classes.errorComponent}>
      <StyledErrorIcon />
      <Typography variant='button' className={classes.errorMessage}>
        {errorMessage}
      </Typography>
    </Box>
  );
};

export default FormError;
