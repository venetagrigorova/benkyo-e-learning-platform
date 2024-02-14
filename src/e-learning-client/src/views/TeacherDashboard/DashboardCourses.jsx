import { Container } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { documentTitleSuffix } from '../../common/strings.enums';
import DashCoursesAccordion from '../../components/TeacherDashboard/CoursesView/Accordion';
import CourseCreationPanel from '../../components/TeacherDashboard/CoursesView/CreatePanel/CourseCreationPanel';
import TopBar from '../../components/TeacherDashboard/TopBar/TopBar';
import TeacherContext from '../../context/TeacherContext';

const DashboardCourses = () => {
  const { teacherState } = useContext(TeacherContext);
  useEffect(() => (document.title = `Dashboard${documentTitleSuffix}`), []);

  return (
    <Container>
      <TopBar />
      {teacherState.isCreateOpen ? <CourseCreationPanel /> : <></>}
      <Container maxWidth='md'>
        <DashCoursesAccordion />
      </Container>
    </Container>
  );
};

export default DashboardCourses;
