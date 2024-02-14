import { CssBaseline } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import CourseContext from '../../context/CourseContext';
import MenuDrawer from '../../components/MenuDrawer/MenuDrawer';
import Layout from '../Layout';
import CourseAppBar from '../../components/CourseAppBar/CourseAppBar';
import { documentTitleSuffix } from '../../common/strings.enums';
import CourseContent from '../../components/CourseDashboard/Course';
import Loader from '../../components/Loader/Loader';

const Course = () => {
  const { courseState } = useContext(CourseContext);

  let title = null;
  let sections = [];
  if (courseState.course) {
    const courseTitle = courseState.course.courseTitle;
    const courseId = courseState.course.courseId;
    title = {
      titleText: courseTitle,
      titleLink: `/courses/${courseId}`,
    };
    if (courseState.sortedSections) {
      courseState.sortedSections.forEach((section) => {
        sections.push({
          menuKey: section.sectionId,
          menuTitle: `${section.sectionOrder}. ${section.sectionTitle}`,
          menuLink: `/courses/${courseId}/sections/${section.sectionId}`,
        });
      });
    }
  }
  useEffect(() => {
    document.title = courseState.course
      ? courseState.course.courseTitle + documentTitleSuffix
      : 'Course not available.';
  }, [courseState]);

  return (
    <>
      <Layout>
        {courseState.course ? (
          <>
            <CourseAppBar
              title={title}
              courseId={courseState.course.courseId}
            />
            <MenuDrawer list={sections} />
            <CourseContent />
          </>
        ) : (
          <CssBaseline>
            <Loader placeholder={'Your course is loading :)'} />
          </CssBaseline>
        )}
      </Layout>
    </>
  );
};

export default Course;
