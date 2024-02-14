import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import { useContext } from 'react';
import TeacherContext from '../../../../context/TeacherContext';
import mainThemeEnum from '../../../../themes/main.theme.enum';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { momentFullTime } from '../../../../common/strings.enums';

const useStyles = makeStyles((theme) => ({
  lessonContainer: {
    marginBottom: theme.spacing(2),
  },
  linkLesson: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  linkPlaceholder: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  placeholderContainer: {
    marginTop: theme.spacing(4),
    maxWidth: '500px',
    margin: 'auto',
    padding: theme.spacing(3),
    cursor: 'pointer',
    '&:hover': {
      border: mainThemeEnum.border.thin,
      transform: 'translate(5px, -5px)',
      boxShadow: `-5px 5px ${theme.palette.common.black}`,
    },
  },
}));

const LessonsOverview = ({ courseId }) => {
  const { teacherState } = useContext(TeacherContext);
  const classes = useStyles();

  return (
    <Box>
      <Typography variant='h3' paragraph>
        Lessons overview
      </Typography>
      {teacherState.currentSection.sectionLessonsInfo.length ? (
        teacherState.currentSection.sectionLessonsInfo.map((lesson) => (
          <Grid
            container
            key={lesson.lessonId}
            className={classes.lessonContainer}
          >
            <Grid item xs={12} md={6}>
              <Typography variant={'h5'}>
                {lesson.lessonOrder}.{' '}
                <Link
                  className={classes.linkLesson}
                  to={`/dashboard/courses/${courseId}/sections/${teacherState.currentSection.sectionId}/lessons/${lesson.lessonId}`}
                >
                  {lesson.lessonTitle}
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>
                {lesson.lessonDate
                  ? 'Scheduled for ' +
                    moment(lesson.lessonDate).format(momentFullTime)
                  : 'Not scheduled yet'}
              </Typography>
            </Grid>
          </Grid>
        ))
      ) : (
        <Link
          className={classes.linkPlaceholder}
          to={`/dashboard/courses/${courseId}/sections/${teacherState.currentSection.sectionId}/lessons/new`}
        >
          <Box className={classes.placeholderContainer}>
            <Typography paragraph align='center'>
              This section was either recently created or you annihilited its
              entire content in an outburst of frustration.
            </Typography>
            <Typography align='center'>
              Doesn't matter, if you're ready, click here to create a new lesson
              :)
            </Typography>
          </Box>
        </Link>
      )}
    </Box>
  );
};

export default LessonsOverview;
