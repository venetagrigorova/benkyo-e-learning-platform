import {
  Box,
  Card,
  CardContent,
  Link,
  makeStyles,
  Modal,
  Typography,
} from '@material-ui/core';
import { useContext, useState } from 'react';
import mainThemeEnum from '../../themes/main.theme.enum';
import UserConnect from '../MainNavbar/UserConnect';
import moment from 'moment';
import ScheduleOutlinedIcon from '@material-ui/icons/ScheduleOutlined';
import AuthContext from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';
import CategoryChips from './CategoryChips/CategoryChips';
import parse from 'html-react-parser';

const useStyles = makeStyles((theme) => ({
  catalogueCardInner: {
    backgroundColor: theme.palette.background.default,
    border: mainThemeEnum.border.bold,
    flexShrink: 1,
    width: '100%',
    margin: theme.spacing.apply(2),
    transition: 'all 0s',
  },
  catalogueCourseCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    border: mainThemeEnum.border.bold,
    transition: 'all 0s',
    '&:hover': {
      boxShadow: `-5px 5px 0px -1px ${theme.palette.text.primary}`,
      transform: 'translate(4px, -4px)',
    },
  },
  chipsBox: {
    backgroundColor: theme.palette.background.default,
  },
  courseAuthor: {
    fontStyle: 'italic',
  },
  mainModal: {
    display: 'flex',
    justifyContent: 'center',
  },
  timeIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.light,
  },
  title: {
    textTransform: 'uppercase',
    marginBottom: theme.spacing(2),
    fontWeight: theme.typography.fontWeightBold,
    cursor: 'pointer',
  },
  titleLink: {
    color: theme.palette.text.primary,
  },
}));

const CatalogueCourseCard = ({ course }) => {
  const { accountState } = useContext(AuthContext);
  const {
    courseId,
    courseTitle,
    courseDescription,
    courseTopics,
    courseOwnerFirst,
    courseOwnerLast,
  } = course;
  const classes = useStyles();
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const history = useHistory();

  const handleOpenLoginModal = () => {
    setOpenLoginModal(true);
  };
  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };

  const handleRedirectCourse = () => {
    history.push(`/courses/${courseId}`);
  };

  return (
    <Card className={classes.catalogueCourseCard} elevation={0}>
      <Card className={classes.catalogueCardInner} elevation={0}>
        <CardContent>
          {moment(course.courseDateRestriction).isAfter() && (
            <Box display='flex'>
              <Typography color='textPrimary' className={classes.timeIcon}>
                <ScheduleOutlinedIcon />
              </Typography>
              <Typography color='textSecondary'>
                Save the date! Available{' '}
                {moment(course.courseDateRestriction).fromNow()}
              </Typography>
            </Box>
          )}
          {accountState.userId ? (
            <Link className={classes.titleLink} to={`/courses/${courseId}`}>
              <Typography
                variant={'h5'}
                className={classes.title}
                onClick={handleRedirectCourse}
              >
                {courseTitle}
              </Typography>
            </Link>
          ) : (
            <>
              <Link className={classes.titleLink}>
                <Typography
                  variant={'h5'}
                  className={classes.title}
                  onClick={handleOpenLoginModal}
                >
                  {courseTitle}
                </Typography>
              </Link>

              <Modal
                open={openLoginModal}
                className={classes.mainModal}
                onClose={handleCloseLoginModal}
                elevation={0}
              >
                <UserConnect />
              </Modal>
            </>
          )}

          <Typography variant={'body1'}>{parse(courseDescription)}</Typography>
          {accountState.userId ? (
            <Typography
              color='textSecondary'
              align='right'
              className={classes.courseAuthor}
            >
              By {courseOwnerFirst} {courseOwnerLast}
            </Typography>
          ) : (
            <></>
          )}

          {courseTopics.length ? (
            <Box marginTop={2}>
              <CategoryChips courseTopics={courseTopics} />
            </Box>
          ) : (
            <></>
          )}
        </CardContent>
      </Card>
    </Card>
  );
};

export default CatalogueCourseCard;
