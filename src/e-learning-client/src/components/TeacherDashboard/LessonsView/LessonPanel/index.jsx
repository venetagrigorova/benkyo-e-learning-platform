import { makeStyles, Typography } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import TeacherContext from '../../../../context/TeacherContext';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../../../common/strings.enums';
import { getToken } from '../../../../utils/token.utils';
import DateRestriction from '../../../Pickers/FutureDateSelector';
import CollapseText from '../../../MicroComponents/CollapseText';
import Separator from '../../../MicroComponents/Separator';
import LessonAttachmentTabs from '../../../LessonDashboard/LessonTabs/LessonAttachmentTabs';
import UpdateLessonPanel from '../UpdatePanel';
import { documentTitleDashboardSuffix } from '../../../../common/strings.enums';

const useStyles = makeStyles((theme) => ({
  editButton: {
    marginBottom: theme.spacing(1),
    cursor: 'pointer',
  },
  editPlaceholder: {
    color: 'rgba(0,0,0,0)',
  },
  gapDiv: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: theme.spacing(2),
  },
}));

const LessonPanel = () => {
  const { teacherState, setTeacherState } = useContext(TeacherContext);
  const [isError, setError] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [isErrorDate, setErrorDate] = useState(false);
  const classes = useStyles();
  const { courseId, lessonId } = useParams();

  // Determines what should be rendered on the lesson panel.
  //
  // If no lesson corresponds to the id provided, error is set to true
  // Else the lesson is displayed.

  useEffect(() => {
    setError(false);
    const currentLesson = teacherState.currentSection.sectionLessonsInfo.filter(
      (item) => {
        return item.lessonId === +lessonId;
      }
    )[0];

    setTeacherState({
      ...teacherState,
      currentLesson: currentLesson,
    });

    setLoaded(true);

    if (!currentLesson) {
      setError(true);
    }
  }, [lessonId]);

  if (!lessonId) {
    document.title = `Lessons${documentTitleDashboardSuffix}`;
    return (
      <Typography>
        Please choose a course to examine or create a new one here :)
      </Typography>
    );
  }

  const handleDateChange = (e) => {
    fetch(
      `${BASE_URL}/courses/${courseId}/sections/${teacherState.currentSection.sectionId}/lessons/${lessonId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonDate: e ? e.toISOString() : null,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          throw new Error();
        }

        setTeacherState({
          ...teacherState,
          currentLesson: res.data,
        });
      })
      .catch((err) => {
        setErrorDate(true);
      });
  };

  const handleEdit = () => {
    setTeacherState({
      ...teacherState,
      isUpdateOpen: true,
    });
  };

  return isError ? (
    <Typography>Lesson not found</Typography>
  ) : isLoaded ? (
    !teacherState.isUpdateOpen ? (
      <>
        <div className={classes.titleContainer}>
          <Typography className={classes.editPlaceholder}>Edit</Typography>
          <Typography variant={'h2'} align='center'>
            {teacherState.currentLesson.lessonTitle}
          </Typography>
          <Typography className={classes.editButton} onClick={handleEdit}>
            Edit
          </Typography>
        </div>

        <DateRestriction
          dateRestriction={teacherState.currentLesson.lessonDate}
          handleDateChange={handleDateChange}
        />
        <div className={classes.gapDiv} />
        <CollapseText
          textContent={teacherState.currentLesson.lessonDescription}
        />
        <Separator />
        <LessonAttachmentTabs
          body={teacherState.currentLesson.lessonContent.body}
          iframes={teacherState.currentLesson.lessonContent.iframes}
        />
      </>
    ) : (
      <UpdateLessonPanel />
    )
  ) : (
    <></>
  );
};

export default LessonPanel;
