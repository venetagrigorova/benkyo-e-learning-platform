import { LinearProgress, makeStyles, Paper } from '@material-ui/core';
import { useEffect, useState } from 'react';
import mainThemeEnum from '../../../../../themes/main.theme.enum';
import { BASE_URL } from '../../../../../common/strings.enums';
import { getToken } from '../../../../../utils/token.utils';
import EnrollPanelCreate from './EnrollPanelCreate';

const useStyles = makeStyles((theme) => ({
  enrollmentModal: {
    margin: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    width: '100%',
    overflow: 'scroll',
    border: mainThemeEnum.border.bold,
  },
}));

const EnrollModalCreate = ({ formData, setFormData }) => {
  const classes = useStyles();
  const [unenrolled, setUnenrolled] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

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

        const unenrolled = res.data;

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
  }, []);

  return (
    <>
      <Paper className={classes.enrollmentModal}>
        {isLoaded ? (
          <>
            <EnrollPanelCreate
              unenrolled={unenrolled}
              formData={formData}
              setFormData={setFormData}
            />
          </>
        ) : (
          <LinearProgress />
        )}
      </Paper>
    </>
  );
};
export default EnrollModalCreate;
