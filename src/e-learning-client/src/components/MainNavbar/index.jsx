import { AppBar, Box, Button, Typography, makeStyles, SvgIcon } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import mainTheme from '../../themes/main.theme';
import AuthContext from '../../context/AuthContext';
import { useContext } from 'react';
import mainThemeEnum from '../../themes/main.theme.enum';
import buttonStyles from './UserConnect/styles/buttonStyles';
import { Link } from 'react-router-dom';
import SearchButton from './SearchButton';
import ProfileBox from './ProfileBox';
import LoginBox from './LoginBox';
import MenuBookSharp from '@material-ui/icons/MenuBookSharp';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
// import { ReactComponent as Logo } from "../../common/images/HappyOwl.svg";
import { ReactComponent as Logo } from "../../common/images/AngryOwl.svg";
const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.default,
    borderBottom: mainThemeEnum.border.bold,
    color: theme.palette.text.primary,
    position: 'sticky',
    userSelect: 'none',
    zIndex: theme.zIndex.drawer + 1,
  },
  buttonIcon: {
    marginRight: theme.spacing(0.5),
  },

  catalogeButton: {
    ...buttonStyles.jumpShadowBorder,
    marginLeft: theme.spacing(2),
  },
  myCoursesButton: {
    ...buttonStyles.jumpShadowBorder,
    marginLeft: theme.spacing(2),
    width: '200px'
  },
  grow: {
    flexGrow: 1,
  },
  link: {
    cursor: 'pointer',
    color: 'inherit',
    textDecoration: 'none',
  },
  logo: {
    padding: theme.spacing(2),
  },
  page: {
    marginTop: mainThemeEnum.marginNavbar(),
  },
  searchButton: {
    // marginRight: theme.spacing(2),
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
    },
  },
  logoImage: {
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
  }
}));

const MainNavbar = () => {
  const { accountState } = useContext(AuthContext);
  const classes = useStyles();

  const renderDashboardLink = () =>
    accountState && accountState.role === 'teacher' ? (
      <Link to='/dashboard' className={classes.link}>
        <Button
          className={classes.catalogeButton}
          color='inherit'
          underline='none'
        >
          <DashboardIcon className={classes.buttonIcon} />
          <Typography variant='h5'>Dashboard</Typography>
        </Button>
      </Link>
    ) : (
      <> </>
    );

    const renderMyCoursesLink = () =>
    accountState && accountState.role === 'student' ? (
      <Link to='/mycourses' className={classes.link}>
        <Button
          className={classes.myCoursesButton}
          color='inherit'
          underline='none'
        >
          <LibraryBooksIcon className={classes.buttonIcon} />
          <Typography variant='h5'>My Courses</Typography>
        </Button>
      </Link>
    ) : (
      <> </>
    );

  return (
    <>
      <AppBar className={classes.appBar} elevation={0} id='main-navbar'>
        <Toolbar>
          <Typography variant='h3' className={classes.logo}>
            <Link className={classes.link} to='/'>
              Benky
              <span style={{ color: mainTheme.palette.secondary.main }}>ō</span>
            </Link>
          </Typography>
          
          {
            // <div className={classes.logoImage}>
            //   <SvgIcon 
            //     component={Logo} 
            //     viewBox="0 0 1400 1400"
            //     width="70px"
            //     height="70px"
            //   />
            // </div>
          }

          <div className={classes.grow} />

          <Box display='flex' alignItems='center'>
            <SearchButton />

            <Link to='/catalogue' className={classes.link}>
              <Button
                className={classes.catalogeButton}
                color='inherit'
                underline='none'
              >
                <MenuBookSharp className={classes.buttonIcon} />
                <Typography variant='h5'>Catalogue</Typography>
              </Button>
            </Link>

            {renderMyCoursesLink()}
            {renderDashboardLink()}
          </Box>
          {!accountState || !accountState.userId ? (
            <LoginBox />
          ) : (
            <ProfileBox />
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default MainNavbar;
