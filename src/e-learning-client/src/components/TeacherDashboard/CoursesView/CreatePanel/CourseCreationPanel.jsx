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
import CourseAudience from '../CourseStats/CourseAudience';
import DateRestriction from '../../../Pickers/FutureDateSelector';
import StudentsCount from '../CourseStats/StudentsCount';
import EnrollModalCreate from './EnrollModalCreate';
import SubmitButton from '../../../SubmitButton/SubmitButton';
import { BASE_URL } from '../../../../common/strings.enums';
import { getToken } from '../../../../utils/token.utils';
import { getAllUsers } from '../../../../requests/userRequests';
import Initializers from '../../../../context/Initializers';
import Showdown from 'showdown';
const converter = new Showdown.Converter();

const useStyles = makeStyles((theme) => ({
  courseCreationContainer: {
    border: mainThemeEnum.border.bold,
    marginBottom: theme.spacing(15),
    padding: theme.spacing(3),
  },
  courseMainRow: {
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

const CourseCreationPanel = () => {
  const classes = useStyles();
  const [errorSubmit, setErrorSubmit] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const { teacherState, setTeacherState } = useContext(TeacherContext);

  const [formData, setFormData] = useState({
    courseTitle: {
      name: 'courseTitle',
      value: '',
      isValid: true,
      validator: (value) => typeof value === 'string' && value.length > 3,
    },
    courseDescription: {
      name: 'courseDescription',
      value: '',
      isValid: true,
      validator: (value) => typeof value === 'string' && value.length > 20,
    },
    courseIsprivate: {
      name: 'courseIsprivate',
      value: false,
    },
    courseDateRestriction: {
      value: null,
    },
    coursePermissions: {
      value: [],
    },
  });

  const handleSubmitNewCourse = async (e) => {
    e.preventDefault();
    setFetching(true);

    const result = await fetch(`${BASE_URL}/courses`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseTitle: formData.courseTitle.value,
        courseDescription: converter.makeHtml(formData.courseDescription.value),
        courseIsprivate: formData.courseIsprivate.value,
        courseDateRestriction: formData.courseDateRestriction.value,
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
        return;
      });

    if (!result) {
      return;
    }

    if (!formData.coursePermissions.value.length) {
      result.coursePermissions = [];
      result.courseSectionsInfo = [];
      result.courseTopics = [];

      setTeacherState({
        ...teacherState,
        courses: [result, ...teacherState.courses],
        createCourse: Initializers.createCourse,
        isCreateOpen: false,
      });

      return;
    }

    const permissions = await fetch(
      `${BASE_URL}/courses/${result.courseId}/permissions`,
      {
        method: 'POST',
        headers: {
          Authorization: `bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users: formData.coursePermissions.value }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          throw new Error();
        }

        return res.data;
      })
      .catch((err) => {
        setErrorSubmit(true);
        return;
      });

    const allUsers = await getAllUsers();

    result.coursePermissions = allUsers.filter((user) =>
      permissions.ok.some((student) => student === user.userId)
    );

    result.courseSectionsInfo = [];

    setTeacherState({
      ...teacherState,
      courses: [result, ...teacherState.courses],
      createCourse: Initializers.createCourse,
      isCreateOpen: false,
    });

    setFetching(false);
  };

  const handleChangeFormField = (e) => {
    const target = e.target;
    setErrorSubmit(false);

    if (target.name === fields.courseDateRestriction) {
      setFormData({
        ...formData,
        courseDateRestriction: {
          ...formData.courseDateRestriction,
          value: target.value,
        },
      });
      return;
    }

    if (target.name === fields.courseIsprivate) {
      setFormData({
        ...formData,
        courseIsprivate: {
          ...formData.courseIsprivate,
          value: !formData.courseIsprivate,
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

  const handleToggleAudience = () => {
    setFormData({
      ...formData,
      courseIsprivate: {
        ...formData.courseIsprivate,
        value: !formData.courseIsprivate.value,
      },
    });
  };

  const handleDateChange = (e) => {
    setFormData({
      ...formData,
      courseDateRestriction: {
        ...formData.courseDateRestriction,
        value: e === null ? e : e.toISOString(),
      },
    });
  };

  // Disables inner borders input fields
  const inputProp = {
    classes: { notchedOutline: classes.noBorder },
  };

  return (
    <>
      <Paper className={classes.courseCreationContainer} elevation={0}>
        <form autoComplete='off' onSubmit={handleSubmitNewCourse}>
          <div>
            <Grid container spacing={2}>
              <Grid item sm={12}>
                <Typography>Title</Typography>

                <TextField
                  required
                  variant='outlined'
                  name={fields.courseTitle}
                  value={formData.courseTitle.value}
                  className={classes.formInput}
                  fullWidth
                  onChange={handleChangeFormField}
                  InputProps={inputProp}
                  error={!formData.courseTitle.isValid}
                />
              </Grid>
              <Grid item sm={12} className={classes.courseMainRow}>
                <Typography>Description</Typography>
                <TextField
                  required
                  name={fields.courseDescription}
                  className={classes.formInput}
                  variant='outlined'
                  multiline={true}
                  fullWidth
                  onChange={handleChangeFormField}
                  // InputProps={passwordProp}
                  error={!formData.courseDescription.isValid}
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
                  You're building your first course, well done! We need a title
                  and description, they will be shown in our catalogue.
                </Typography>
                <Typography
                  className={classes.tutorialParagraph}
                  paragraph
                  align='justify'
                >
                  You can enroll students now or later, it's up to you. If you
                  also set a restriction on the date, your students will be able
                  to see the course in the catalogue but not its content.
                </Typography>
                <Typography
                  className={classes.tutorialParagraph}
                  paragraph
                  align='justify'
                >
                  If you make your course private, only your class will be able
                  to see it.
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
                <StudentsCount
                  courseId='new'
                  coursePermissions={formData.coursePermissions.value}
                  create
                >
                  <EnrollModalCreate
                    formData={formData}
                    setFormData={setFormData}
                  />
                </StudentsCount>
                <DateRestriction
                  dateRestriction={formData.courseDateRestriction.value}
                  handleDateChange={handleDateChange}
                />
                <CourseAudience
                  courseIsprivate={formData.courseIsprivate.value}
                  toggleCoursePrivacy={handleToggleAudience}
                  string='will be'
                />
                <SubmitButton
                  placeholder='create course'
                  isFetching={isFetching}
                  disableIf={
                    !formData.courseTitle.value ||
                    !formData.courseDescription.value ||
                    !formData.courseTitle.isValid ||
                    !formData.courseDescription.isValid
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

export default CourseCreationPanel;
