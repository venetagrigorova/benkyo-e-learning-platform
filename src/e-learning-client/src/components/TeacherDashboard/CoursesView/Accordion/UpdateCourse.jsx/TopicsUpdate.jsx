import {
  Box,
  Button,
  FormControl,
  InputLabel,
  makeStyles,
  Select,
} from '@material-ui/core';
import { useContext, useState } from 'react';
import CatalogueContext from '../../../../../context/CatalogueContext';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import { BASE_URL } from '../../../../../common/strings.enums';
import { getToken } from '../../../../../utils/token.utils';
import { getFirstFilteredCourse } from '../../../../../utils/helpers';
import TeacherContext from '../../../../../context/TeacherContext';

const useStyles = makeStyles((theme) => ({
  topicsContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
      color: theme.palette.primary.main,
    },
  },
}));

const TopicsUpdate = ({ courseId, courseTopics, setEdit }) => {
  const { teacherState, setTeacherState } = useContext(TeacherContext);
  const { catalogueState, setCatalogueState } = useContext(CatalogueContext);
  const [topics, setTopics] = useState(courseTopics.map((i) => i.topicId + ''));

  const classes = useStyles();
  const handleChangeTopics = (e) => {
    const { options } = e.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setTopics(value);
  };

  const submitTopics = (e) => {
    e.preventDefault();

    fetch(`${BASE_URL}/courses/${courseId}/topics`, {
      method: 'PUT',
      headers: {
        Authorization: `bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topics: topics.map((i) => +i) }),
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
        newCourse.courseTopics = res.data;

        setTeacherState({
          ...teacherState,
          courses: [
            ...teacherState.courses.filter(
              (item) => item.courseId !== courseId
            ),
            newCourse,
          ],
        });

        setCatalogueState({
          ...catalogueState,
          courses: [
            ...catalogueState.courses.filter(
              (item) => item.courseId !== courseId
            ),
            newCourse,
          ],
        });

        setEdit(false);
      });
  };

  return (
    <Box className={classes.topicsContainer}>
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor='select-multiple-native'>
          Categories
        </InputLabel>
        <Select
          multiple
          native
          value={topics}
          onChange={handleChangeTopics}
          inputProps={{
            id: 'select-multiple-native',
          }}
        >
          {catalogueState.topics
            .sort((a, b) => a.topicName.localeCompare(b.topicName))
            .map((item) => (
              <option key={item.topicId + item.topicName} value={item.topicId}>
                {item.topicName}
              </option>
            ))}
        </Select>
      </FormControl>
      <Button className={classes.button} onClick={submitTopics}>
        <CheckCircleRoundedIcon />
      </Button>
    </Box>
  );
};

export default TopicsUpdate;
