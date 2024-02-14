import { Container } from '@material-ui/core';
import Layout from '../Layout';
import DashboardCourses from './DashboardCourses';
import DashboardLessons from './DashboardLessons';
import DashboardSections from './DashboardSections';

const TeacherDashboard = ({ location, match }) => {
  const courseId = +match.params.courseId;
  const sectionId = +match.params.sectionId;
  const lessonId = +match.params.lessonId;

  const renderView = (courseId, sectionId, lessonId) => {
    if (/lessons/.test(location.pathname)) {
      return (
        <>
          <DashboardLessons
            courseId={courseId}
            sectionId={sectionId}
            lessonId={lessonId}
            newLesson={/(new|new\/)$/.test(location.pathname)}
          />
        </>
      );
    }

    if (Number.isInteger(courseId)) {
      return (
        <DashboardSections
          courseId={courseId}
          sectionId={Number.isInteger(courseId) && sectionId}
          match={match}
        />
      );
    }

    return <DashboardCourses />;
  };
  return (
    <>
      <Layout>
        <Container>{renderView(courseId, sectionId, lessonId)}</Container>
      </Layout>
    </>
  );
};

export default TeacherDashboard;
