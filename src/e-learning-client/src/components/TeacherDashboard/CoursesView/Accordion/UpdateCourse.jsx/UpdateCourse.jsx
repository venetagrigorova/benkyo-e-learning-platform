import { Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { useContext, useState } from 'react';
import fields from '../../../../../common/fields.enum';
import TeacherContext from '../../../../../context/TeacherContext';
import Showdown from 'showdown';
import SubmitButton from '../../../../SubmitButton/SubmitButton';
import { BASE_URL } from '../../../../../common/strings.enums';
import { getToken } from '../../../../../utils/token.utils';
import { getFirstFilteredCourse } from '../../../../../utils/helpers';
import DangerButton from '../../../../Buttons/DangerButton';

const converter = new Showdown.Converter();

const useStyles = makeStyles((theme) => ({
  deleteButton: {
    margin: theme.spacing(1),
  },
}));

const UpdateCourse = ({ course, setEdit }) => {
  const { teacherState, setTeacherState } = useContext(TeacherContext);
  const classes = useStyles();
  const [isFetching, setFetching] = useState(false);
  const [isFetchingDelete, setFetchingDelete] = useState(false);
  const [isErrorSubmit, setErrorSubmit] = useState(false);
  const [isErrorDelete, setErrorDelete] = useState(false);

  const [formData, setFormData] = useState({
    courseTitle: {
      name: 'courseTitle',
      value: course.courseTitle,
      isValid: true,
      validator: (value) => typeof value === 'string' && value.length > 3,
    },
    courseDescription: {
      name: 'courseDescription',
      value: converter.makeMarkdown(course.courseDescription),
      isValid: true,
      validator: (value) => typeof value === 'string' && value.length > 20,
    },
    courseTopics: {
      name: 'courseTopics',
      value: course.courseTopics,
    },
  });

  const handleSubmitUpdateCourse = async (e) => {
    e.preventDefault();
    setFetching(true);

    fetch(`${BASE_URL}/courses/${course.courseId}`, {
      method: 'PUT',
      headers: {
        Authorization: `bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseTitle: formData.courseTitle.value,
        courseDescription: converter.makeHtml(formData.courseDescription.value),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          throw new Error(res.data);
        }

        // next lines selectively upgrade the course in TeacherState.courses without deleting previous data.
        // Server returns array with info except course permissions, and application crashes if those are deleted (StudentsCount needs them)
        const courseToUpdate = getFirstFilteredCourse(
          teacherState.courses,
          course.courseId
        );

        setTeacherState({
          ...teacherState,
          courses: [
            ...teacherState.courses.filter(
              (item) => item.courseId !== course.courseId
            ),
            {
              ...courseToUpdate,
              courseTitle: formData.courseTitle.value,
              courseDescription: converter.makeHtml(
                formData.courseDescription.value
              ),
            },
          ],
        });

        setEdit(false);
        setFetching(false);
      })
      .catch((err) => {
        setErrorSubmit(true);
        setFetching(false);
      });
  };

  const handleChangeFormField = (e) => {
    const target = e.target;
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

  const handleDelete = (e) => {
    e.preventDefault();
    setFetchingDelete(true);
    fetch(`${BASE_URL}/courses/${course.courseId}`, {
      method: 'DELETE',
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
          courses: teacherState.courses.filter(
            (item) => item.courseId !== course.courseId
          ),
        });

        setFetchingDelete(false);
        setEdit(false);
      })
      .catch((err) => {
        setErrorDelete(true);
        setFetching(false);
      });
  };

  return (
    <form autoComplete='off' onSubmit={handleSubmitUpdateCourse}>
      <div>
        <Grid container spacing={2} className={classes.registrationForm}>
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
              error={!formData.courseTitle.isValid}
            />
          </Grid>
          <Grid item sm={12}>
            <Typography>Description</Typography>
            <TextField
              required
              name={fields.courseDescription}
              className={classes.formInput}
              value={formData.courseDescription.value}
              variant='outlined'
              multiline={true}
              fullWidth
              onChange={handleChangeFormField}
              error={!formData.courseDescription.isValid}
            />
          </Grid>
          <Grid item sm={12}>
            <SubmitButton
              placeholder={'ship changes'}
              isFetching={isFetching}
              noMargin
              white
              bold
              disableIf={
                !formData.courseTitle.value ||
                !formData.courseDescription.value ||
                !formData.courseTitle.isValid ||
                !formData.courseDescription.isValid
              }
            />
          </Grid>
          <div className={classes.deleteButton}>
            <DangerButton
              onClick={handleDelete}
              placeholder={'Delete this course'}
              isFetching={isFetchingDelete}
            />
          </div>
        </Grid>
      </div>
    </form>
  );
};

export default UpdateCourse;
