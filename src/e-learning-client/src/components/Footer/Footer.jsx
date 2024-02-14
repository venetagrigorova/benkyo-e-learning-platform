import { Box, Container, Grid, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import mainThemeEnum from '../../themes/main.theme.enum';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.default,
    position: 'fixed',
    bottom: 0,
    textAlign: 'center',
    paddingBottom: '10px',
    width: '100%',
    height: '80px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderTop: mainThemeEnum.border.bold,
    zIndex: '1201',
  },
  footerContainer: {
    marginTop: '10px',
  },
  link: {
    color: theme.palette.common.black,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Box px={{ xs: 3, sm: 2 }} py={{ xs: 2, sm: 2 }}>
        <Container className={classes.footerContainer}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4}>
              <Box>
                <Link to='/' className={classes.link}>
                  Contact
                </Link>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box>
                <Link to='/api/doc' className={classes.link}>
                  Documentation
                </Link>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box>
                <Link to='/' className={classes.link}>
                  Support
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </footer>
  );
};

export default Footer;
