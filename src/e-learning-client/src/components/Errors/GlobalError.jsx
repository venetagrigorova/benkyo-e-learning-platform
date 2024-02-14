import { Box, Card, makeStyles, Paper, Typography } from '@material-ui/core';
import mainThemeEnum from '../../themes/main.theme.enum';

const useStyles = makeStyles((theme) => ({
  errorContainer: {
    width: '50%',
    height: '50%',
    overflow: 'auto',
    margin: 'auto',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: mainThemeEnum.border.bold,

    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(2),
      width: 'auto',
      height: 'auto',
    },
  },
  errorText: {
    color: theme.palette.error.main,
    marginLeft: theme.spacing(2),
  },
}));

const GlobalError = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.errorContainer} elevation={0}>
      <Box>
        <Typography
          variant='h3'
          className={classes.errorText}
          align='center'
          paragraph
        >
          Error
        </Typography>
        <Typography
          variant='h6'
          className={classes.errorText}
          // align='center'
          paragraph
        >
          <br />
          We are very sorry for the inconvenience,
          <br />
          things are acting up a little on our side.
          <br />
          It should not take long before Benkyō is back online.
        </Typography>
        <Typography variant={'h6'} className={classes.errorText}>
          Try again later!
        </Typography>
      </Box>
    </Paper>
  );
};

export default GlobalError;
