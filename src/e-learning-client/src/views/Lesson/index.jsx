import { useContext, useEffect } from 'react';
import CourseContext from '../../context/CourseContext';
import Layout from '../Layout';
import CourseAppBar from '../../components/CourseAppBar/CourseAppBar';
import MenuDrawer from '../../components/MenuDrawer/MenuDrawer';
import { documentTitleSuffix } from '../../common/strings.enums';
import LessonContent from '../../components/LessonDashboard/Lesson/Lesson';
import CustomError from '../../components/Errors/CustomError';


const Lesson = (props) => {
  const { courseState } = useContext(CourseContext);
  const sectionIdFromPath = +props.match.params.sectionId;
  const lessonIdFromPath = +props.match.params.lessonId;

  let title = null;
  let sections = [];

  let sectionIdValid = false;
  let lessonIdValid = false;

  sectionIdValid = courseState.sections?.hasOwnProperty(sectionIdFromPath);
  if (sectionIdValid) {
    lessonIdValid = courseState.lessons[sectionIdFromPath]?.hasOwnProperty(lessonIdFromPath);
    if (lessonIdValid) {
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
          })
        })
      }
    }
  }
  useEffect(() => {
    document.title = courseState.course && sectionIdValid && lessonIdValid
        ? courseState.course.courseTitle + documentTitleSuffix
        : 'Lesson not available.';
  }, [courseState, sectionIdValid, lessonIdValid]);

  return (
    <>
      <Layout>
        {courseState.course && sectionIdValid && lessonIdValid ? (
          <>
            <CourseAppBar title={title} />
            <MenuDrawer list={sections} />
            <LessonContent
              lessonId={lessonIdFromPath}
              sectionId={sectionIdFromPath}
            />
          </>
        ) : (
          <CustomError errorMessage={'This lesson is not available!'}/>
        )}
      </Layout>
    </>
  );
};

export default Lesson;
