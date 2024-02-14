import { Container, makeStyles } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import MakePanel from './Utils/MakePanel';
import { BASE_URL } from '../../../../../common/strings.enums';
import { getToken } from '../../../../../utils/token.utils';
import TeacherContext from '../../../../../context/TeacherContext';
import dataGridBaseColumns from '../../../../../common/dataGridBaseColumn';
import DangerButton from '../../../../Buttons/DangerButton';

const useStyles = makeStyles((theme) => ({
  root: {
    border: 0,
  },
}));

const ClassPanel = ({ courseId, coursePermissions }) => {
  const [page, setPage] = useState(0);
  const { teacherState, setTeacherState } = useContext(TeacherContext);
  const [users, setUsers] = useState([]);
  const [danger, setDanger] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      coursePermissions.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName.toUpperCase(),
        birthdate: moment(user.birthdate).format('MMMM, Do YYYY'),
        email: user.email,
        id: user.userId,
      }))
    );
  }, [coursePermissions]);

  const classes = useStyles();

  const columns = dataGridBaseColumns;

  const handleChange = (e) => {
    setUsers(e);
  };

  const handleDanger = () => {
    setDanger(!danger);
  };

  const handleUnenroll = () => {
    fetch(`${BASE_URL}/courses/${courseId}/permissions`, {
      method: 'DELETE',
      headers: {
        Authorization: `bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ users }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          throw new Error();
        }

        const newCourse = teacherState.courses.filter(
          (course) => course.courseId === courseId
        )[0];
        const newPermissions = coursePermissions.filter(
          (permission) =>
            !res.data.ok.some((userId) => permission.userId === userId)
        );
        newCourse.coursePermissions = newPermissions;

        setTeacherState({
          ...teacherState,
          courses: teacherState.courses.map((course) =>
            course.courseId === courseId ? newCourse : course
          ),
        });

        setRows(
          newPermissions.map((user) => ({
            firstName: user.firstName,
            lastName: user.lastName.toUpperCase(),
            birthdate: moment(user.birthdate).format('MMMM, Do YYYY'),
            email: user.email,
            id: user.userId,
          }))
        );
      })
      .catch((err) => {});
  };

  return (
    <>
      <MakePanel>
        <DataGrid
          className={classes.root}
          columns={[
            ...columns,
            { field: 'birthdate', headerName: 'Birthdate', width: 150 },
          ]}
          rows={rows}
          autoHeight
          pageSize={10}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          columnResizeIcon
          checkboxSelection={danger}
          onSelectionModelChange={handleChange}
        />
      </MakePanel>

      <Container style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <DangerButton
          onClick={handleUnenroll}
          placeholder='Unenroll students'
          isActive={users.length}
        />
      </Container>
    </>
  );
};

export default ClassPanel;
