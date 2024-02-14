/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { BASE_URL } from '../common/strings.enums';
import AuthContext from '../context/AuthContext';
import { getToken } from '../utils/token.utils';
import TeacherContext from '../context/TeacherContext';
import Loader from '../components/Loader/Loader';
import { CssBaseline } from '@material-ui/core';
import Initializers from '../context/Initializers';

const TeacherDataLoader = ({ children }) => {
  const { accountState } = useContext(AuthContext);
  const [teacherState, setTeacherState] = useState({});
  const [isLoaded, setLoaded] = useState(false);
  const [isError, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const coursesOnly = await fetch(
        `${BASE_URL}/users/${accountState.userId}/courses`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${getToken()}`,
          },
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
          setError(true);
        });

      let courses = [];

      if (coursesOnly) {
        courses = await Promise.all(
          coursesOnly.map(async (course) => {
            const coursePermissions = await fetch(
              `${BASE_URL}/courses/${course.courseId}/permissions`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `bearer ${getToken()}`,
                },
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
                setError(true);
              });
            return { ...course, coursePermissions };
          })
        );

      }


      courses &&
        setTeacherState({
          courses,
          search: '',
          currentCourse: null,
          isLoaded: true,
          isCreateOpen: false,
          isEnrollOpen: false,
          createCourse: Initializers.createCourse,
        });

        courses && setLoaded(true);
    }

    if (accountState && accountState.role === 'teacher') {
      fetchData();
    } else {
      setLoaded(true);
    }
  }, [accountState]);

  return (
    <>
      <TeacherContext.Provider value={{ teacherState, setTeacherState }}>
        {isLoaded ? (
          <>{children}</>
        ) : (
          <CssBaseline>
            <Loader placeholder={'Your dashboard is loading :)'} />
          </CssBaseline>
        )}
      </TeacherContext.Provider>
    </>
  );
};

export default TeacherDataLoader;
