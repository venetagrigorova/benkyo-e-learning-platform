import { CssBaseline } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '../common/strings.enums';
import Loader from '../components/Loader/Loader';
import AuthContext from '../context/AuthContext';
import CatalogueContext from '../context/CatalogueContext';
import CourseContext from '../context/CourseContext';
import { getCourseIdIfValidPath } from '../utils/helpers';
import { getToken } from '../utils/token.utils';
import ErrorView from '../views/Error';

const CourseDataLoader = (props) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const courseId = getCourseIdIfValidPath(currentPath, props.path);
  const { accountState } = useContext(AuthContext);
  const { catalogueState, setCatalogueState } = useContext(CatalogueContext);
  const [courseState, setCourseState] = useState({});
  const [isLoaded, setLoaded] = useState(false);
  const [isError, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // get course data
      const course = await fetch(`${BASE_URL}/courses/${courseId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.errorCode) {
            throw new Error(res);
          }
          return res.data;
        })
        .catch(() => {
          setError(true);
        });

      if (course && !course.isEnrolled) {
        await fetch(`${BASE_URL}/courses/${courseId}/selfenroll`, {
          method: 'POST',
          headers: {
            Authorization: `bearer ${getToken()}`,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.errorCode) {
              throw new Error();
            }
            course.isEnrolled = true;
            setCatalogueState({
              ...catalogueState,
              courses: [
                ...catalogueState.courses.filter(
                  (item) => item.courseId !== course.courseId
                ),
                course,
              ],
            });
          })
          .catch((err) => {});
      }

      let sections = {};
      let lessons = {};
      let teacher = {};
      let courseProgress = {};
      let announcements = {};
      let sortedSections = [];
      let sortedLessons = {};

      if (course) {
        // get sections data
        const fetchedSections = await fetch(
          `${BASE_URL}/courses/${courseId}/sections/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
          .then((response) => response.json())
          .then((res) => {
            if (res.errorCode) {
              throw new Error(res);
            }
            if (Object.keys(res.data[0]).length === 0) {
              return [];
            }
            return res.data;
          })
          .catch(() => {
            setError(true);
          });
        if (fetchedSections) {
          sortedSections = fetchedSections;
          sections = fetchedSections.reduce((acc, section) => {
            acc[section.sectionId] = section;
            return acc;
          }, {});
        } else {
          sortedSections = [];
          sections = [];
        }

        // get lessons data
        async function getLessons() {
          if (fetchedSections) {
            const lessonsPerSection = {};
            for (const section of fetchedSections) {
              const fetchedLessons = await fetch(
                `${BASE_URL}/courses/${courseId}/sections/${section.sectionId}/lessons/`,
                {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
              )
                .then((response) => response.json())
                .then((res) => {
                  if (res.errorCode) {
                    throw new Error(true);
                  }
                  if (Object.keys(res.data).length === 0) {
                    return [];
                  }
                  return res.data;
                })
                .catch(() => {
                  setError(true);
                });

              if (fetchedLessons) {
                sortedLessons[section.sectionId] = fetchedLessons;
                lessonsPerSection[section.sectionId] = fetchedLessons.reduce(
                  (acc, lesson) => {
                    acc[lesson.lessonId] = lesson;
                    return acc;
                  },
                  {}
                );
              } else {
                sortedLessons[section.sectionId] = [];
                lessonsPerSection[section.sectionId] = [];
              }
            }
            return lessonsPerSection;
          }
          return [];
        }
        lessons = await getLessons();

        // get teacher data
        const courseOwnerId = !course ? [] : course.courseOwnerId;
        teacher = await fetch(`${BASE_URL}/users/${courseOwnerId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.errorCode) {
              setError(res.errorCode);
              return [];
            }

            return res.data[0];
          });

        // get course progress data
        courseProgress = await fetch(
          `${BASE_URL}/courses/${courseId}/progress/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
          .then((response) => response.json())
          .then((res) => {
            if (res.errorCode) {
              throw new Error(res);
            }
            return res.data;
          })
          .catch((err) => {
            setError(true);
          });

        // get announcements data
        const fetchedAnnouncements = await fetch(
          `${BASE_URL}/courses/${courseId}/announcements/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
          .then((response) => response.json())
          .then((res) => {
            if (res.errorCode) {
              throw new Error(res);
            }
            return res.data;
          })
          .catch((err) => {
            setError(true);
          });
        announcements = !fetchedAnnouncements
          ? []
          : fetchedAnnouncements.reduce((acc, announcement) => {
              acc[announcement.announcementId] = announcement;
              return acc;
            }, {});
      }

      // set course state
      setCourseState({
        course,
        sections,
        lessons,
        teacher,
        courseProgress,
        announcements,
        sortedSections,
        sortedLessons,
      });
      course && setLoaded(true);
    }
    const isLoggedIn = Object.keys(accountState).length !== 0;

    if (courseId && isLoggedIn) {
      fetchData();
    } else {
      setLoaded(true);
    }
  }, [courseId, accountState]);

  return (
    <CourseContext.Provider value={{ courseState, setCourseState }}>
      {isError ? (
        <ErrorView />
      ) : isLoaded ? (
        <>{props.children}</>
      ) : (
        <CssBaseline>
          <Loader placeholder={'Your course is loading :)'} />
        </CssBaseline>
      )}
    </CourseContext.Provider>
  );
};

export default CourseDataLoader;
