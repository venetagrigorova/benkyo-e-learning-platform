import { makeStyles } from '@material-ui/core';
import { useContext } from 'react';
import CourseContext from '../../../context/CourseContext';
import SingleLessonCard from './SingleLessonCard';

const useStyles = makeStyles((theme) => ({
  lessons: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingRight: '15px',
  },
}));

const Lessons = ({ lessons, courseId, sectionId }) => {
  const classes = useStyles();
  const { courseState } = useContext(CourseContext);
  const teacherId = courseState.teacher.userId;

  return (
    <div className={classes.lessons}>
      {lessons.map((lesson) => (
        <SingleLessonCard
          key={lesson.lessonId}
          lesson={lesson}
          courseId={courseId}
          sectionId={sectionId}
          teacherId={teacherId}
        />
      ))}
    </div>
  );
};

export default Lessons;
