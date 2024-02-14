import { Box, Button, Grid, makeStyles, Typography } from '@material-ui/core';
import CourseAudience from '../../CourseStats/CourseAudience';
import DateRestriction from '../../../../Pickers/FutureDateSelector';
import EnrollModal from '../../CourseStats/EnrollModal';
import SectionsCount from '../../CourseStats/SectionsCounts';
import StudentsCount from '../../CourseStats/StudentsCount';
import parse from 'html-react-parser';
import { useContext } from 'react';
import { BASE_URL } from '../../../../../common/strings.enums';
import { getToken } from '../../../../../utils/token.utils';
import TeacherContext from '../../../../../context/TeacherContext';
import mainThemeEnum from '../../../../../themes/main.theme.enum';
import CourseTopics from '../../CourseStats/CourseTopics';
import UpdateCourse from '../UpdateCourse.jsx/UpdateCourse';
import { Link } from 'react-router-dom';
import TopicsUpdate from '../UpdateCourse.jsx/TopicsUpdate';

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
  },
  statsColumn: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
  sectionButton: {
    backgroundColor: theme.palette.background.default,
    border: mainThemeEnum.border.medium,
    marginTop: theme.spacing(3),
    padding: theme.spacing(1),
    transition: 'all 0s',
    '&:hover': {
      backgroundColor: theme.palette.background.default,
      boxShadow: `-3px 3px ${theme.palette.common.black}`,
      transform: 'translate(3px, -3px)',
    },

    '&.Mui-disabled ': {
      borderColor: theme.palette.grey[400],
    },
  },
}));

const CoursePreview = ({ course, isEdit, setEdit }) => {
  const { teacherState, setTeacherState } = useContext(TeacherContext);
  const {
    courseId,
    courseDescription,
    courseIsprivate,
    coursePermissions,
    courseSectionsInfo,
    courseDateRestriction,
    courseTopics,
  } = course;
  const classes = useStyles();

  const handleDateChange = (e) => {
    fetch(`${BASE_URL}/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        Authorization: `bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseDateRestriction: e ? e.toISOString() : null,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          throw new Error();
        }

        const newCourse = teacherState.courses.filter(
          (course) => course.courseId === courseId
        )[0];

        newCourse.courseDateRestriction = e ? e.toISOString() : null;

        setTeacherState({
          ...teacherState,
          courses: teacherState.courses.map((course) =>
            course.courseId === courseId ? newCourse : course
          ),
        });
      })
      .catch((err) => {
        // TODO handle error
      });
  };

  const toggleCoursePrivacy = () => {
    fetch(`${BASE_URL}/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        Authorization: `bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseIsprivate: !courseIsprivate,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          throw new Error();
        }

        const newCourse = teacherState.courses.filter(
          (course) => course.courseId === courseId
        )[0];

        newCourse.courseIsprivate = !courseIsprivate;

        setTeacherState({
          ...teacherState,
          courses: teacherState.courses.map((course) =>
            course.courseId === courseId ? newCourse : course
          ),
        });
      })
      .catch((err) => {
        // TODO handle error
      });
  };

  const toggleEdit = () => {
    setEdit(!isEdit);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        {isEdit ? (
          <UpdateCourse course={course} setEdit={setEdit} />
        ) : (
          <>
            <div className={classes.flexTextIcon}>
              <Typography variant={'h6'}>Description</Typography>
            </div>
            <Typography
              variant={'body1'}
              gutterBottom
              align='justify'
              component={Box}
            >
              {parse(courseDescription)}
            </Typography>
          </>
        )}
      </Grid>

      <Grid item xs={12} md={6} className={classes.statsColumn}>
        <StudentsCount
          courseId={courseId}
          coursePermissions={coursePermissions}
        >
          <EnrollModal
            courseId={courseId}
            coursePermissions={coursePermissions}
          />
        </StudentsCount>
        <SectionsCount
          courseId={courseId}
          courseSectionsInfo={courseSectionsInfo}
        />
        <DateRestriction
          courseId={courseId}
          handleDateChange={handleDateChange}
          dateRestriction={courseDateRestriction}
        />
        <CourseAudience
          courseIsprivate={courseIsprivate}
          toggleCoursePrivacy={toggleCoursePrivacy}
        />

        {isEdit ? (
          <TopicsUpdate
            courseId={courseId}
            courseTopics={courseTopics}
            setEdit={setEdit}
          />
        ) : (
          <CourseTopics courseTopics={courseTopics} />
        )}

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              className={classes.sectionButton}
              fullWidth
              onClick={toggleEdit}
            >
              <Typography variant={'h6'}>
                {isEdit ? 'CLOSE' : 'EDIT'}
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Link
              to={`/dashboard/courses/${courseId}`}
              className={classes.link}
            >
              <Button
                className={classes.sectionButton}
                fullWidth
                disabled={isEdit}
              >
                <Typography variant={'h6'}>view course</Typography>
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default CoursePreview;
