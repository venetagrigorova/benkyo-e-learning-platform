import { Box, makeStyles, Typography } from '@material-ui/core';
import DateRestriction from '../../../Pickers/FutureDateSelector';
import { useContext } from 'react';
import { BASE_URL } from '../../../../common/strings.enums';
import { getToken } from '../../../../utils/token.utils';
import TeacherContext from '../../../../context/TeacherContext';
import {
  getFirstFilteredCourse,
  getFirstFilteredSection,
  replaceSectionInCourse,
} from '../../../../utils/helpers';
import SectionUpdatePanel from '../UpdatePanel/SectionUpdatePanel';
import CollapseText from '../../../MicroComponents/CollapseText';

const useStyles = makeStyles((theme) => ({
  editButton: {
    cursor: 'pointer',
  },
  fadeBarHide: {
    display: 'flex',
    justifyContent: 'center',
  },
  sectionTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const SectionOverview = ({ courseId, section }) => {
  const { teacherState, setTeacherState } = useContext(TeacherContext);
  const classes = useStyles();

  const handleDateChange = (e) => {
    fetch(`${BASE_URL}/courses/${courseId}/sections/${section.sectionId}`, {
      method: 'PUT',
      headers: {
        Authorization: `bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sectionDateRestriction: e ? e.toISOString() : null,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          throw new Error();
        }

        const newCourse = getFirstFilteredCourse(
          teacherState.courses,
          courseId
        );

        const newSection = getFirstFilteredSection(
          newCourse.courseSectionsInfo,
          section.sectionId
        );

        newSection.sectionDateRestriction = e.toISOString();

        const courseUpdated = replaceSectionInCourse(newCourse, newSection);

        setTeacherState({
          ...teacherState,
          courses: teacherState.courses.map((course) =>
            course.courseId === courseId ? courseUpdated : course
          ),
        });
      })
      .catch((err) => {
        // TODO handle error
      });
  };

  const handleEdit = () => {
    setTeacherState({ ...teacherState, isUpdateOpen: true });
  };

  return teacherState.isUpdateOpen ? (
    <SectionUpdatePanel courseId={courseId} section={section} />
  ) : (
    <Box className={classes.root}>
      <div className={classes.sectionTitleContainer}>
        <Typography variant={'h3'} paragraph>
          {section.sectionTitle}
        </Typography>

        <Typography className={classes.editButton} onClick={handleEdit}>
          Edit
        </Typography>
      </div>
      <DateRestriction
        dateRestriction={section.sectionDateRestriction}
        handleDateChange={handleDateChange}
      />

      <CollapseText textContent={section.sectionDescription} />
    </Box>
  );
};

export default SectionOverview;
