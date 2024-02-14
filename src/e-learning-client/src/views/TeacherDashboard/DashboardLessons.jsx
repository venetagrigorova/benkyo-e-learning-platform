import { useContext, useEffect, useState } from 'react';
import MenuDrawer from '../../components/MenuDrawer/MenuDrawer';
import AddLessonDrawerButton from '../../components/TeacherDashboard/LessonsView/AddLessonDrawerButton/AddLessonDrawerButton';
import CreateLessonPanel from '../../components/TeacherDashboard/LessonsView/CreationPanel';
import TeacherContext from '../../context/TeacherContext';
import LessonPanel from '../../components/TeacherDashboard/LessonsView/LessonPanel';
import { Box, makeStyles } from '@material-ui/core';
import mainThemeEnum from '../../themes/main.theme.enum';
import { BASE_URL } from '../../common/strings.enums';
import { getToken } from '../../utils/token.utils';

const useStyles = makeStyles((theme) => ({
  mainContainer: { marginTop: theme.spacing(3) },
}));
const DashboardLessons = ({ courseId, sectionId, lessonId, newLesson }) => {
  const { teacherState, setTeacherState } = useContext(TeacherContext);
  const [isLoaded, setLoaded] = useState(false);
  const [isError, setError] = useState(false);
  const classes = useStyles();
  const section = teacherState.currentSection;

  useEffect(() => {
    fetch(`${BASE_URL}/courses/${courseId}/sections/${sectionId}/lessons`, {
      method: 'GET',
      headers: {
        Authorization: `bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          throw new Error();
        }

        setTeacherState({
          ...teacherState,
          currentSection: {
            ...teacherState.currentSection,
            sectionLessonsInfo: res.data,
          },
        });
        setLoaded(true);
      })
      .catch((err) => {
        setError(true);
      });
  }, [courseId, sectionId]);

  const list =
    // section &&
    isLoaded &&
    section.sectionLessonsInfo
      .map((item) => ({
        order: item.lessonOrder,
        menuTitle: `${item.lessonOrder}. ${item.lessonTitle}`,
        menuLink: `/dashboard/courses/${courseId}/sections/${sectionId}/lessons/${item.lessonId}`,
      }))
      .sort((a, b) => a.order - b.order);

  return isLoaded ? (
    <>
      <MenuDrawer
        list={list}
        noOffset
        dashboard
        lessons
        backTo={`/dashboard/courses/${courseId}/sections/${sectionId}`}
        backToTitle='to section'
      >
        <AddLessonDrawerButton courseId={courseId} sectionId={sectionId} />
      </MenuDrawer>
      <div style={{ marginLeft: mainThemeEnum.sizing.menuDrawerWidth }}>
        <Box className={classes.mainContainer}>
          {newLesson ? (
            <CreateLessonPanel courseId={courseId} sectionId={sectionId} />
          ) : (
            <LessonPanel lessonId={lessonId} />
          )}
        </Box>
      </div>
    </>
  ) : (
    <></>
  );
};

export default DashboardLessons;
