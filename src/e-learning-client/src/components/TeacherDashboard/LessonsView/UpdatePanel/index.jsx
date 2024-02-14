import {
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { documentTitleDashboardSuffix } from '../../../../common/strings.enums';
import fields from '../../../../common/fields.enum';
import TeacherContext from '../../../../context/TeacherContext';
import mainThemeEnum from '../../../../themes/main.theme.enum';
import SubmitButton from '../../../SubmitButton/SubmitButton';
import DateRestriction from '../../../Pickers/FutureDateSelector';
import Editor from './Editor';
import IFramesManager from './IFramesManager';
import Tutorial from './Tutorial';
import { BASE_URL } from '../../../../common/strings.enums';
import { getToken } from '../../../../utils/token.utils';
import Showdown from 'showdown';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { Redirect, useParams } from 'react-router-dom';
import DangerButton from '../../../Buttons/DangerButton';
const converter = new Showdown.Converter();

const useStyles = makeStyles((theme) => ({
  lessonCreationContainer: {
    position: 'relative',
    border: mainThemeEnum.border.bold,
    marginBottom: theme.spacing(15),
    paddingBottom: theme.spacing(10),
  },
  closeIconContainer: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  closeIcon: {
    cursor: 'pointer',
  },
  deleteContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
  divisonContainer: {
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  gap: {
    marginTop: theme.spacing(10),
  },
  lessonMainRow: {
    marginBottom: theme.spacing(2),
  },
  statsColumn: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
}));

const UpdateLessonPanel = () => {
  const { teacherState, setTeacherState } = useContext(TeacherContext);
  const { courseId, sectionId } = useParams();
  const [isFetching, setFetching] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState(false);
  const [isFetchingDelete, setFetchingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState(false);
  const [isDeleted, setDeleted] = useState(false);

  const classes = useStyles();

  const [formData, setFormData] = useState({
    lessonTitle: {
      name: 'lessonTitle',
      value: teacherState.currentLesson.lessonTitle,
      isValid: true,
      validator: (value) =>
        typeof value === 'string' && value.length >= 3 && value.length <= 50,
    },
    lessonDescription: {
      name: 'lessonDescription',
      value: converter.makeMarkdown(
        teacherState.currentLesson.lessonDescription
      ),
      isValid: true,
      validator: (value) => typeof value === 'string' && value.length > 20,
    },
    lessonDate: {
      value: teacherState.currentLesson.lessonDate,
    },
    lessonBody: {
      value: converter.makeHtml(teacherState.currentLesson.lessonContent.body),
      mode: 'markdown',
      isValid: true,
      validator: (value) => value.length > 20,
    },
    lessonIframes: {
      value: teacherState.currentLesson.lessonContent.iframes,
      isValid: true,
      validator: (value) =>
        Array.isArray(value) &&
        (value === [] || value.every((item) => typeof item === 'string')),
    },
  });
  useEffect(() => {
    document.title = `Edit lesson` + documentTitleDashboardSuffix;
  });

  const handleChangeFormField = (e) => {
    const target = e.target;
    setErrorSubmit(false);

    if (target.name === fields.lessonDate) {
      setFormData({
        ...formData,
        lessonDate: {
          ...formData.lessonDate,
          value: target.value,
        },
      });
      return;
    }

    const fieldObject = formData[target.name];

    setFormData({
      ...formData,
      [target.name]: {
        ...fieldObject,
        value: target.value,
        isValid: fieldObject.validator(target.value),
      },
    });
  };

  const handleDateChange = (e) => {
    setFormData({
      ...formData,
      lessonDate: {
        ...formData.lessonDate,
        value: e === null ? e : e.toISOString(),
      },
    });
  };

  const inputProp = {
    classes: { notchedOutline: classes.noBorder },
  };

  const handleSubmitNewLesson = (e) => {
    e.preventDefault();

    const newLesson = {
      lessonTitle: formData.lessonTitle.value,
      lessonDescription: converter.makeHtml(formData.lessonDescription.value),
      lessonContent: {
        body: converter.makeHtml(formData.lessonBody.value),
        iframes: formData.lessonIframes.value.length
          ? formData.lessonIframes.value
          : [],
      },
    };

    if (formData.lessonDate.value) {
      newLesson.lessonDate = formData.lessonDate.value;
    }

    fetch(
      `${BASE_URL}/courses/${courseId}/sections/${sectionId}/lessons/${teacherState.currentLesson.lessonId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLesson),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          throw new Error(res);
        }

        setTeacherState({
          ...teacherState,
          currentLesson: res.data,
          isUpdateOpen: false,
        });
      })
      .catch((err) => {
        setErrorSubmit(true);
      });
  };

  const handleClose = () => {
    setTeacherState({
      ...teacherState,
      isUpdateOpen: false,
    });
  };

  const handleDelete = () => {
    const lessonId = teacherState.currentLesson.lessonId;
    setFetchingDelete(true);
    fetch(
      `${BASE_URL}/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `bearer ${getToken()}`,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          throw new Error();
        }

        setTeacherState({
          ...teacherState,
          currentSection: {
            ...teacherState.currentSection,
            sectionLessonsInfo:
              teacherState.currentSection.sectionLessonsInfo.filter(
                (item) => item.lessonId !== lessonId
              ),
          },
        });
      })
      .catch((err) => {
        setErrorDelete(true);
      });
    setFetchingDelete(false);

    setTeacherState({
      ...teacherState,
      isUpdateOpen: false,
    });

    setTeacherState({
      ...teacherState,
      currentSection: {
        ...teacherState.currentSection,
        sectionLessonsInfo:
          teacherState.currentSection.sectionLessonsInfo.filter(
            (item) => item.lessonId !== lessonId
          ),
      },
    });
    setDeleted(true);
  };

  if (isDeleted) {
    return (
      <Redirect
        to={`/dashboard/courses/${courseId}/sections/${sectionId}/lessons/`}
      />
    );
  }

  return (
    <Paper className={classes.lessonCreationContainer} elevation={0}>
      <form autoComplete='off' onSubmit={handleSubmitNewLesson}>
        <Grid container spacing={2} className={classes.divisonContainer}>
          <Grid item sm={12}>
            <Typography variant={'h6'}>Title</Typography>
            <div onClick={handleClose} className={classes.closeIconContainer}>
              <ClearRoundedIcon className={classes.closeIcon} />
            </div>

            <TextField
              required
              variant='outlined'
              name={fields.lessonTitle}
              value={formData.lessonTitle.value}
              className={classes.formInput}
              fullWidth
              onChange={handleChangeFormField}
              InputProps={inputProp}
              error={!formData.lessonTitle.isValid}
            />
          </Grid>

          <Grid item sm={12} className={classes.lessonMainRow}>
            <Typography variant={'h6'}>Description</Typography>

            <TextField
              required
              name={fields.lessonDescription}
              className={classes.formInput}
              variant='outlined'
              value={formData.lessonDescription.value}
              multiline={true}
              fullWidth
              onChange={handleChangeFormField}
              error={!formData.lessonDescription.isValid}
            />
          </Grid>
        </Grid>

        <div>
          <Grid container spacing={4} className={classes.divisonContainer}>
            <Tutorial />
            <Grid item xs={12} md={6} className={classes.statsColumn}>
              <DateRestriction
                dateRestriction={formData.lessonDate.value}
                handleDateChange={handleDateChange}
                lesson
              />

              <SubmitButton
                placeholder='update'
                isFetching={isFetching}
                disableIf={
                  !formData.lessonTitle.value ||
                  !formData.lessonDescription.value ||
                  !formData.lessonBody.value ||
                  !formData.lessonIframes.value ||
                  !formData.lessonTitle.isValid ||
                  !formData.lessonDescription.isValid ||
                  !formData.lessonBody.isValid ||
                  !formData.lessonIframes.isValid
                }
              />
            </Grid>
          </Grid>
          {/* <Separator />
          <Typography variant={'h5'}>Lesson editor</Typography> */}
          <Editor lessonBody={formData.lessonBody} setFormData={setFormData} />
          <div className={classes.gap} />
          <IFramesManager
            lessonIframes={formData.lessonIframes.value}
            setFormData={setFormData}
          />
        </div>
      </form>
      <div className={classes.deleteContainer}>
        <DangerButton
          onClick={handleDelete}
          placeholder='delete lesson'
          isFetching={isFetchingDelete}
        />
      </div>
    </Paper>
  );
};

export default UpdateLessonPanel;
