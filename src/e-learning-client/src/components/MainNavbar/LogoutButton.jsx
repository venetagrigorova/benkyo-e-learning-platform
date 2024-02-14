import { makeStyles, MenuItem, Typography } from '@material-ui/core';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import { BASE_URL } from '../../common/strings.enums';
import mainTheme from '../../themes/main.theme';
import { getToken, removeToken } from '../../utils/token.utils';
import { useHistory, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { useContext } from 'react';
import TeacherContext from '../../context/TeacherContext';
import CourseContext from '../../context/CourseContext';
import UserContext from '../../context/UserContext';

const useStyles = makeStyles({
  logoutContainer: {
    display: 'flex',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: mainTheme.palette.error.light,
    },
  },
  logoutLabel: {
    flexGrow: 1,
  },
});

const LogoutButton = () => {
  const { accountState, setAccountState } = useContext(AuthContext);
  const { teacherState, setTeacherState } = useContext(TeacherContext);
  const { courseState, setCourseState } = useContext(CourseContext);
  const { userState, setUserState } = useContext(UserContext);

  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();

    fetch(`${BASE_URL}/auth`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.errorCode) {
          setAccountState({});
          if (location.pathname !== '/') {
            history.push('/');
          }
          return;
        }
        throw new Error();
      })
      .catch((err) => {
        // history.push('/error')
      });

    // Reinitialize contexts

    accountState && setAccountState({});
    courseState && setCourseState({});
    teacherState && setTeacherState({});
    userState && setUserState({});
    removeToken();
  };

  return (
    <>
      <MenuItem onClick={handleLogout} className={classes.logoutContainer}>
        <Typography className={classes.logoutLabel}>Logout</Typography>
        <PowerSettingsNew />
      </MenuItem>
    </>
  );
};

export default LogoutButton;
