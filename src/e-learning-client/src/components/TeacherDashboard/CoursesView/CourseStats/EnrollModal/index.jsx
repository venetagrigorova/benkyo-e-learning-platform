import { LinearProgress, makeStyles, Paper } from '@material-ui/core';
import { useEffect, useState } from 'react';
import mainThemeEnum from '../../../../../themes/main.theme.enum';
import { BASE_URL } from '../../../../../common/strings.enums';
import { getToken } from '../../../../../utils/token.utils';
import SwipeableViews from 'react-swipeable-views';
import EnrollModalTabBar from './Utils/EnrollModalTab';
import ClassPanel from './ClassPanel';
import EnrollPanel from './EnrollPanel';

const useStyles = makeStyles((theme) => ({
  enrollmentModal: {
    margin: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    width: '100%',
    overflow: 'scroll',
    border: mainThemeEnum.border.bold,
  },
}));

const EnrollModal = ({ courseId, coursePermissions }) => {
  const classes = useStyles();
  const [unenrolled, setUnenrolled] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [value, setValue] = useState(0);

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  useEffect(() => {
    fetch(`${BASE_URL}/users`, {
      method: 'GET',
      headers: {
        Authorization: `bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          throw new Error(res.errorCode);
        }

        const unenrolled = res.data.filter(
          (user) =>
            !coursePermissions.some(
              (enrolled) => enrolled.userId === user.userId
            )
        );

        setUnenrolled(
          unenrolled.map((user) => ({
            id: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            birthday: user.birthday,
          }))
        );
        setLoaded(true);
      })
      .catch((err) => {});
  }, [courseId, coursePermissions]);

  return (
    <>
      <Paper className={classes.enrollmentModal}>
        {isLoaded ? (
          <>
            <EnrollModalTabBar
              value={value}
              setValue={setValue}
              courseId={courseId}
            />
            <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
              <ClassPanel
                courseId={courseId}
                coursePermissions={coursePermissions}
              />
              <EnrollPanel
                unenrolled={unenrolled}
                setUnenrolled={setUnenrolled}
                isLoaded={isLoaded}
                courseId={courseId}
                coursePermissions={coursePermissions}
              />
            </SwipeableViews>
          </>
        ) : (
          <LinearProgress />
        )}
      </Paper>
    </>
  );
};
export default EnrollModal;
