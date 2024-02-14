import {
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { useContext, useState } from 'react';
import fields from '../../../../common/fields.enum';
import TeacherContext from '../../../../context/TeacherContext';
import mainThemeEnum from '../../../../themes/main.theme.enum';
import DateRestriction from '../../../Pickers/FutureDateSelector';
import SubmitButton from '../../../SubmitButton/SubmitButton';
import { BASE_URL } from '../../../../common/strings.enums';
import { getToken } from '../../../../utils/token.utils';
import { getFirstFilteredCourse } from '../../../../utils/helpers';
import SectionOrderCreate from './SectionOrderCreate/SectionOrderCreate';
import showdown from 'showdown';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  closeIcon: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
    fontSize: theme.typography.fontSize * 2,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  sectionCreationContainer: {
    border: mainThemeEnum.border.bold,
    marginBottom: theme.spacing(15),
    padding: theme.spacing(3),
  },
  sectionMainRow: {
    marginBottom: theme.spacing(2),
  },
  statsColumn: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
  tutorialParagraph: {
    borderLeft: mainThemeEnum.borderGreen.medium,
    paddingLeft: theme.spacing(1),
  },
}));

const SectionCreationPanel = ({ courseId }) => {
  const classes = useStyles();
  const [errorSubmit, setErrorSubmit] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const { teacherState, setTeacherState } = useContext(TeacherContext);
  const converter = new showdown.Converter();

  const [formData, setFormData] = useState({
    sectionTitle: {
      name: 'sectionTitle',
      value: '',
      isValid: true,
      validator: (value) => typeof value === 'string' && value.length > 3,
    },
    sectionDescription: {
      name: 'sectionDescription',
      value: '',
      isValid: true,
      validator: (value) => typeof value === 'string' && value.length > 20,
    },
    sectionDateRestriction: {
      value: null,
    },
    sectionOrder: {
      value:
        getFirstFilteredCourse(teacherState.courses, courseId)
          .courseSectionsInfo.length + 1,
      isValid: true,
      validator: (value) => Number.isInteger(+value),
    },
  });

  const handleSubmitNewSection = async (e) => {
    e.preventDefault();
    setFetching(true);

    const result = await fetch(`${BASE_URL}/courses/${courseId}/sections`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sectionTitle: formData.sectionTitle.value,
        sectionDescription: converter.makeHtml(
          formData.sectionDescription.value
        ),
        sectionDateRestriction: formData.sectionDateRestriction.value,
        sectionOrder: formData.sectionOrder.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          throw new Error(res.data);
        }

        return res.data;
      })
      .catch((err) => {
        setErrorSubmit(true);
        setFetching(false);
        return;
      });

    if (!result) {
      return;
    }

    const newCourse = getFirstFilteredCourse(teacherState.courses, courseId);

    newCourse.courseSectionsInfo.push(result);

    setTeacherState({
      ...teacherState,
      courses: [
        ...teacherState.courses.filter(
          (course) => course.courseId !== courseId
        ),
        newCourse,
      ],
      isCreateOpen: false,
    });

    setFetching(false);
  };

  const handleChangeFormField = (e) => {
    const target = e.target;
    setErrorSubmit(false);

    if (target.name === fields.sectionDateRestriction) {
      setFormData({
        ...formData,
        sectionDateRestriction: {
          ...formData.sectionDateRestriction,
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
      sectionDateRestriction: {
        ...formData.sectionDateRestriction,
        value: e === null ? e : e.toISOString(),
      },
    });
  };

  // Disables inner borders input fields
  const inputProp = {
    classes: { notchedOutline: classes.noBorder },
  };

  const handleChangeOrderField = (e) => {
    const value = e.target.value;
    if (Number.isInteger(+value) || !value) {
      setFormData({
        ...formData,
        sectionOrder: {
          ...formData.sectionOrder,
          value: value ? +value : 0,
        },
      });

      return;
    }
  };

  const handleCloseIcon = () => {
    setTeacherState({
      ...teacherState,
      isCreateOpen: false,
    });
  };

  return (
    <>
      <Paper className={classes.sectionCreationContainer} elevation={0}>
        <form autoComplete='off' onSubmit={handleSubmitNewSection}>
          <div style={{ position: 'relative' }}>
            <CloseIcon
              className={classes.closeIcon}
              onClick={handleCloseIcon}
            />
            <Grid container spacing={2}>
              <Grid item sm={12}>
                <SectionOrderCreate
                  formData={formData}
                  handleChangeOrderField={handleChangeOrderField}
                />
              </Grid>

              <Grid item sm={12}>
                <Typography variant={'h6'}>Title</Typography>

                <TextField
                  required
                  variant='outlined'
                  name={fields.sectionTitle}
                  value={formData.sectionTitle.value}
                  // className={classes.formInput}
                  fullWidth
                  onChange={handleChangeFormField}
                  InputProps={inputProp}
                  error={!formData.sectionTitle.isValid}
                />
              </Grid>

              <Grid item sm={12} className={classes.sectionMainRow}>
                <Typography variant={'h6'}>Description</Typography>

                <TextField
                  required
                  name={fields.sectionDescription}
                  className={classes.formInput}
                  variant='outlined'
                  multiline={true}
                  fullWidth
                  onChange={handleChangeFormField}
                  // InputProps={passwordProp}
                  error={!formData.sectionDescription.isValid}
                />
              </Grid>
            </Grid>
          </div>

          <div>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography
                  className={classes.tutorialParagraph}
                  paragraph
                  align='justify'
                >
                  Hi there! To open a section, we need a title and description.
                  You can also add a date restriction if you want the content to
                  be released later.
                </Typography>

                <Typography
                  className={classes.tutorialParagraph}
                  paragraph
                  align='justify'
                >
                  Don't forget the number of the section to keep your course
                  organised!
                </Typography>

                <Typography
                  className={classes.tutorialParagraph}
                  paragraph
                  align='justify'
                >
                  Have fun!
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} className={classes.statsColumn}>
                <DateRestriction
                  dateRestriction={formData.sectionDateRestriction.value}
                  handleDateChange={handleDateChange}
                />

                <SubmitButton
                  placeholder='open the section'
                  isFetching={isFetching}
                  disableIf={
                    !formData.sectionTitle.value ||
                    !formData.sectionDescription.value ||
                    !formData.sectionTitle.isValid ||
                    !formData.sectionDescription.isValid ||
                    !formData.sectionOrder.value
                  }
                />
              </Grid>
            </Grid>
          </div>
        </form>
      </Paper>
    </>
  );
};

export default SectionCreationPanel;
