import {
  Container,
  Grid,
  LinearProgress,
  makeStyles,
  Typography,
  withStyles,
} from '@material-ui/core';
import mainThemeEnum from '../../themes/main.theme.enum';

const useStyles = makeStyles((theme) => ({
  flexContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(3),
  },
  letter: {
    color: theme.palette.secondary.main,
  },
  root: {
    width: '100%',
    height: 30,
    marginTop: theme.spacing(30),
  },
}));

const Loader = ({ placeholder }) => {
  const classes = useStyles();

  const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 30,
      marginLeft: theme.spacing(30),
      marginRight: theme.spacing(30),
      marginTop: theme.spacing(10),
      border: mainThemeEnum.border.bold,
      backgroundColor: theme.palette.background.default,
    },
  }))(LinearProgress);

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Container className={classes.flexContainer}>
          <Typography variant={'h1'}>
            Benky<span className={classes.letter}>ō</span>{' '}
          </Typography>
        </Container>
        <Grid item xs={12}>
          <Container className={classes.flexContainer}>
            <Typography variant={'h4'}>{placeholder}</Typography>
          </Container>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <BorderLinearProgress />
      </Grid>
    </Grid>
  );
};

export default Loader;
