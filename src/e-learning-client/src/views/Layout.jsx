import { CssBaseline, makeStyles } from '@material-ui/core';
import MainNavbar from '../components/MainNavbar';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});

const Layout = ({ children }) => {
  const classes = useStyles();
  return (
    <>
      <CssBaseline />
      <MainNavbar />
      <div className={classes.root}>{children}</div>
    </>
  );
};

export default Layout;
