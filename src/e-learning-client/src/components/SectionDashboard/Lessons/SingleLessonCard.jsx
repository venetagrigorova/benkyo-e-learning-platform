import {
  Box,
  Card,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import mainThemeEnum from '../../../themes/main.theme.enum';
import moment from 'moment';
import PublishIcon from '@material-ui/icons/Publish';
import AlignedTextIcon from '../../MicroComponents/AlignedTextIcon';
import { useContext, useState } from 'react';
import CourseContext from '../../../context/CourseContext';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import {
  markLessonComplete,
  markLessonIncomplete,
} from '../../../requests/lessonRequests';
import AuthContext from '../../../context/AuthContext';
import parse from 'html-react-parser';
import { momentFullTime } from '../../../common/strings.enums';

const useStyles = makeStyles((theme) => ({
  lessonCard: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: '15px',
  },
  lessonCardOuter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    width: '100%',
    border: mainThemeEnum.border.bold,
    transition: 'all 0s',
    '&:hover': {
      boxShadow: `-5px 5px 0px -1px ${theme.palette.text.primary}`,
      transform: 'translate(4px, -4px)',
    },
  },
  lessonCardInner: {
    backgroundColor: theme.palette.background.default,
    border: mainThemeEnum.border.bold,
    flexShrink: 1,
    width: '100%',
    margin: theme.spacing.apply(2),
    transition: 'all 0s',
  },
  lessonCardContent: {
    display: 'flex',
    justifyContent: 'flex-start',
    textAlign: 'justify',
  },
  lessonInfo: {
    width: '100%',
    display: 'block',
  },
  progressStatusIcon: {
    width: '10%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& :first-child': {
      fontSize: theme.typography.fontSize * 2,
    },
    marginLeft: '15px',
  },
  completionIcon: {
    color: theme.palette.primary.main,
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    cursor: 'pointer',
  },
  titleLink: {
    color: theme.palette.text.primary,
  },
  lessonTitle: {
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const SingleLessonCard = ({ lesson, courseId, sectionId, teacherId }) => {
  const classes = useStyles();
  const lessonLink = `/courses/${courseId}/sections/${sectionId}/lessons/${lesson.lessonId}`;
  const { accountState } = useContext(AuthContext);

  const handleRedirectLesson = () => {
    window.open(lessonLink, "_blank");
    // win.focus();
  };

  const { courseState, setCourseState } = useContext(CourseContext);
  const completeLessonIds = courseState.courseProgress.completeLessonIds;
  const [isLessonComplete, setIsLessonComplete] = useState(
    completeLessonIds ? completeLessonIds.includes(lesson.lessonId) : false
  );

  const handleCompleteLesson = (lessonId) => {
    setIsLessonComplete(true);
    markLessonComplete(courseId, sectionId, lessonId);
    const completeLessons = courseState.courseProgress.completeLessons + 1;
    const completeLessonIds = courseState.courseProgress.completeLessonIds;
    completeLessonIds.push(lessonId);
    setCourseState({
      ...courseState,
      courseProgress: {
        completeLessonIds,
        completeLessons,
        courseId: courseState.courseProgress.courseId,
        userId: courseState.courseProgress.userId,
      },
    });
    return;
  };

  const handleIncompleteLesson = (lessonId) => {
    setIsLessonComplete(false);
    markLessonIncomplete(courseId, sectionId, lessonId);
    const completeLessons = courseState.courseProgress.completeLessons - 1;
    const lessonIdIndex = courseState.courseProgress.completeLessonIds.indexOf(lessonId);
    const completeLessonIds = courseState.courseProgress.completeLessonIds;
    if (lessonIdIndex >= 0) {
      completeLessonIds.splice(lessonIdIndex, 1);
    }
    setCourseState({
      ...courseState,
      courseProgress: {
        completeLessonIds,
        completeLessons,
        courseId: courseState.courseProgress.courseId,
        userId: courseState.courseProgress.userId,
      },
    });
    return;
  };

  return (
    <Box className={classes.lessonCard}>
      <Card className={classes.lessonCardOuter} elevation={0}>
        <Card className={classes.lessonCardInner} elevation={0}>
          <CardContent className={classes.lessonCardContent}>
            <Box className={classes.lessonInfo} display='flex'>
              <div className={classes.lessonTitle}>
                <Typography
                  variant={'h6'}
                  className={classes.title}
                  onClick={handleRedirectLesson}
                >
                  {lesson.lessonTitle}
                </Typography>
              </div>

              <AlignedTextIcon>
                <PublishIcon></PublishIcon>
                <Typography className={classes.lessonTime} variant={'body2'}>
                  Uploaded on{' '}
                  {moment(lesson.lessonUploadDate).format(momentFullTime)}
                </Typography>
              </AlignedTextIcon>

              <div className={classes.lessonDescription}>
                <Typography variant={'body2'}>
                  {parse(lesson.lessonDescription)}
                </Typography>
              </div>
            </Box>

            {accountState.userId === teacherId ? null : (
              <Box className={classes.progressStatusIcon}>
                {isLessonComplete ? (
                  <CheckCircleIcon
                    className={classes.completionIcon}
                    onClick={() => handleIncompleteLesson(lesson.lessonId)}
                  />
                ) : (
                  <CheckCircleOutlineIcon
                    className={classes.completionIcon}
                    onClick={() => handleCompleteLesson(lesson.lessonId)}
                  />
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Card>
    </Box>
  );
};

export default SingleLessonCard;
