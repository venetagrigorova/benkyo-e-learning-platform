import { Box, makeStyles } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import MenuDrawer from '../../components/MenuDrawer/MenuDrawer';
import Separator from '../../components/MicroComponents/Separator';
import AddSectionDrawerButton from '../../components/TeacherDashboard/SectionsView/AddSectionDrawerButton/AddSectionDrawerButton';
import SectionCreationPanel from '../../components/TeacherDashboard/SectionsView/CreationPanel/SectionCreationPanel';
import LessonsOverview from '../../components/TeacherDashboard/SectionsView/LessonsOverview';
import SectionOverview from '../../components/TeacherDashboard/SectionsView/SectionOverview/SectionOverview';
import TeacherContext from '../../context/TeacherContext';
import mainThemeEnum from '../../themes/main.theme.enum';
import { getFirstFilteredCourse } from '../../utils/helpers';
import {
  BASE_URL,
  documentTitleSuffix,
  documentTitleDashboardSuffix,
} from '../../common/strings.enums';
import { getToken } from '../../utils/token.utils';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    marginTop: theme.spacing(3),
  },
}));
const DashboardSections = ({ match }) => {
  const { teacherState, setTeacherState } = useContext(TeacherContext);
  const [isLoaded, setLoaded] = useState(false);
  const [isError, setError] = useState(false);
  const classes = useStyles();

  const courseId = +match.params.courseId;
  const sectionId = +match.params.sectionId;
  const sectionsInfo = getFirstFilteredCourse(
    teacherState.courses,
    courseId
  ).courseSectionsInfo;
  const list = sectionsInfo
    .map((item) => ({
      order: item.sectionOrder,
      menuTitle: `${item.sectionOrder}. ${item.sectionTitle}`,
      menuLink: `/dashboard/courses/${courseId}/sections/${item.sectionId}`,
    }))
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    Number.isInteger(sectionId) &&
      fetch(`${BASE_URL}/courses/${courseId}/sections/${sectionId}`, {
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
            currentSection: res.data,
          });
          setLoaded(true);
        })
        .catch((err) => {
          setError(true);
        });
  }, [courseId, sectionId]);

  document.title = isLoaded
    ? `${teacherState.currentSection.sectionOrder}. ${teacherState.currentSection.sectionTitle}${documentTitleDashboardSuffix}${documentTitleSuffix}`
    : `Dashboard ${documentTitleSuffix}`;

  return (
    <>
      <MenuDrawer
        list={list}
        noOffset
        dashboard
        backTo={`/dashboard`}
        backToTitle='courses'
      >
        <AddSectionDrawerButton />
      </MenuDrawer>
      <div style={{ marginLeft: mainThemeEnum.sizing.menuDrawerWidth }}>
        <Box className={classes.mainContainer}>
          {teacherState.isCreateOpen ? (
            <SectionCreationPanel courseId={courseId} />
          ) : Number.isInteger(sectionId) && isLoaded ? (
            <>
              <SectionOverview
                courseId={courseId}
                section={teacherState.currentSection}
              />
              <Separator />
              <LessonsOverview courseId={courseId} />
            </>
          ) : (
            <></>
          )}
        </Box>
      </div>
    </>
  );
};

export default DashboardSections;
