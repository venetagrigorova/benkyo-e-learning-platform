import { useContext, useEffect } from 'react';
import CourseContext from '../../context/CourseContext';
import MenuDrawer from '../../components/MenuDrawer/MenuDrawer';
import Layout from '../Layout';
import CourseAppBar from '../../components/CourseAppBar/CourseAppBar';
import { documentTitleSuffix } from '../../common/strings.enums';
import SectionContent from '../../components/SectionDashboard/Section/Section';
import moment from 'moment';
import AuthContext from '../../context/AuthContext';
import { momentFullTime } from '../../common/strings.enums';
import CustomError from '../../components/Errors/CustomError';


const Section = (props) => {
  const { courseState } = useContext(CourseContext);
  const { accountState } = useContext(AuthContext);
  const sectionIdFromPath = +props.match.params.sectionId;

  let title = null;
  let sections = [];
  let sectionDateRestriction = null;

  let sectionIdValid = false;
  sectionIdValid = courseState.sections?.hasOwnProperty(sectionIdFromPath);

  if (sectionIdValid) {
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

  const renderSectionContent = () => {
    sectionDateRestriction = courseState.sections[sectionIdFromPath].sectionDateRestriction;
    if (accountState.role === "teacher") {
      return <SectionContent sectionId={sectionIdFromPath} />
    } else {
      if (moment(sectionDateRestriction).isAfter()) {
        return (
            <CustomError errorMessage={
              `This section is not available yet!
              \n
              Come back on ${moment(sectionDateRestriction).format(momentFullTime)}`
            } />
        );
      } else {
        return <SectionContent sectionId={sectionIdFromPath} />;
      }
    }
  }

  useEffect(() => {
    document.title =
      courseState.course && sectionIdValid
        ? courseState.course.courseTitle + documentTitleSuffix
        : 'Section not available.';
  }, [courseState, sectionIdValid]);

  return (
    <>
      <Layout>
        {courseState.course && sectionIdValid ? (
          <>
            <CourseAppBar title={title} />
            <MenuDrawer list={sections} />
            {renderSectionContent()}
          </>
        ) : (
          <CustomError errorMessage={"This section is not available!"}/>
        )}
      </Layout>
    </>
  );
};

export default Section;
