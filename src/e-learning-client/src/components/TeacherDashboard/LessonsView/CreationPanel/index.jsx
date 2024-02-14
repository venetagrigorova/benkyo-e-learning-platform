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
import LessonOrderCreate from './LessonOrderCreate/LessonOrderCreate';
import Editor from './Editor';
import IFramesManager from './IFramesManager';
import Tutorial from './Tutorial';
import { BASE_URL } from '../../../../common/strings.enums';
import { getToken } from '../../../../utils/token.utils';
import Showdown from 'showdown';
import { Redirect } from 'react-router-dom';
import sanitizeHtml from 'sanitize-html';
const converter = new Showdown.Converter();

const useStyles = makeStyles((theme) => ({
  lessonCreationContainer: {
    border: mainThemeEnum.border.bold,
    marginBottom: theme.spacing(15),
    paddingBottom: theme.spacing(10),
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

const CreateLessonPanel = ({ courseId, sectionId }) => {
  const { teacherState, setTeacherState } = useContext(TeacherContext);
  const [isFetching, setFetching] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState(false);
  const [newId, setNewId] = useState(null);
  const classes = useStyles();

  const [formData, setFormData] = useState({
    lessonTitle: {
      name: 'lessonTitle',
      value: '',
      isValid: true,
      validator: (value) =>
        typeof value === 'string' && value.length >= 3 && value.length <= 50,
    },
    lessonDescription: {
      name: 'lessonDescription',
      value: '',
      isValid: true,
      validator: (value) => typeof value === 'string' && value.length > 20,
    },
    lessonDate: {
      value: null,
    },
    lessonOrder: {
      value: teacherState.currentSection.sectionLessonsInfo.length + 1,
      isValid: true,
      validator: (value) => !value || Number.isInteger(+value),
    },
    lessonBody: {
      value: '',
      isValid: true,
      validator: (value) => value.length > 20,
    },
    lessonIframes: {
      value: [],
      isValid: true,
      validator: (value) =>
        Array.isArray(value) &&
        (value === [] || value.every((item) => typeof item === 'string')),
    },
  });

  useEffect(() => {
    document.title = `New lesson` + documentTitleDashboardSuffix;
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

  const handleChangeOrderField = (e) => {
    const value = e.target.value;
    if (Number.isInteger(+value) || !value) {
      setFormData({
        ...formData,
        lessonOrder: {
          ...formData.lessonOrder,
          value: value,
        },
      });

      return;
    }
  };

  const handleSubmitNewLesson = (e) => {
    e.preventDefault();

    const newLesson = {
      lessonTitle: formData.lessonTitle.value,
      lessonDescription: converter.makeHtml(formData.lessonDescription.value),
      lessonOrder: +formData.lessonOrder.value,
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

    fetch(`${BASE_URL}/courses/${courseId}/sections/${sectionId}/lessons`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLesson),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          throw new Error(res);
        }

        setTeacherState({
          ...teacherState,
          currentSection: {
            ...teacherState.currentSection,
            sectionLessonsInfo: [
              res.data,
              ...teacherState.currentSection.sectionLessonsInfo,
            ],
          },
          isCreateOpen: false,
        });
        setNewId(res.data.lessonId);
      })
      .catch((err) => {
        setErrorSubmit(true);
      });
  };

  if (newId) {
    return <Redirect to={`/dashboard/courses/${courseId}`} />;
  }

  return (
    <Paper className={classes.lessonCreationContainer} elevation={0}>
      <form autoComplete='off' onSubmit={handleSubmitNewLesson}>
        <Grid container spacing={2} className={classes.divisonContainer}>
          <Grid item sm={12}>
            <LessonOrderCreate
              formData={formData}
              handleChangeOrderField={handleChangeOrderField}
            />
          </Grid>

          <Grid item sm={12}>
            <Typography variant={'h6'}>Title</Typography>

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
                placeholder='upload'
                isFetching={isFetching}
                disableIf={
                  !formData.lessonTitle.value ||
                  !formData.lessonDescription.value ||
                  !formData.lessonOrder.value ||
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
    </Paper>
  );
};

export default CreateLessonPanel;
