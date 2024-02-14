import React, { useContext, useState } from 'react';
import {
  makeStyles,
  withStyles,
  AppBar,
  Button,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import mainTheme from '../../themes/main.theme';
import mainThemeEnum from '../../themes/main.theme.enum';
import { BASE_URL } from '../../common/constants';
import { getToken } from '../../utils/token.utils';
import CatalogueContext from '../../context/CatalogueContext';
import CourseContext from '../../context/CourseContext';
import AuthContext from '../../context/AuthContext';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: 1,
    boxShadow: '0px 0px 0px',
    marginTop: mainThemeEnum.marginNavbar(),
    backgroundColor: mainTheme.palette.primary.main,
    borderBottom: mainThemeEnum.border.bold,
  },
  unenrollButton: {
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
      color: theme.palette.common.white,
    },
  },
  title: {
    underline: 'none',
    textDecoration: 'none',
    overflow: 'scroll',
    scrollbarWidth: 'none' /* Firefox */,
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  toolBar: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
}));

const NoHoverButton = withStyles({
  root: {
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: mainTheme.palette.primary.main,
    },
  },
})(Button);

const CourseAppBar = ({ title, courseId }) => {
  const classes = useStyles();
  const { setCatalogueState } = useContext(CatalogueContext);
  const { courseState, setCourseState } = useContext(CourseContext);
  const { accountState } = useContext(AuthContext);
  const [isUnenrolled, setUnenrolled] = useState(false);

  const handleUnenroll = () => {
    fetch(`${BASE_URL}/courses/${courseId}/selfenroll`, {
      method: 'DELETE',
      headers: {
        Authorization: `bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          throw new Error();
        }

        setCatalogueState((prev) => ({
          ...prev,
          courses: [
            ...prev.courses.filter((item) => item.courseId !== courseId),
            {
              ...courseState.course,
              isEnrolled: false,
            },
          ],
        }));
        setUnenrolled(true);
      })
      .catch((err) => {});
  };

  if (isUnenrolled) {
    setCourseState({});
    return <Redirect to='/' />;
  }

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        <Link to={title.titleLink} className={classes.title}>
          <NoHoverButton>
            <Typography variant={"h4"} noWrap>
              {title.titleText}
            </Typography>
          </NoHoverButton>
        </Link>
        {accountState.role !== "teacher" ? (
          <Button className={classes.unenrollButton} onClick={handleUnenroll}>
            unenroll
          </Button>
        ) : (
          <></>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default CourseAppBar;
