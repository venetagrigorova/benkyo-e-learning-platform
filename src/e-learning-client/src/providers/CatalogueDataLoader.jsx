import { useEffect, useState, useContext } from 'react';
import { BASE_URL } from '../common/strings.enums';
import CatalogueContext from '../context/CatalogueContext';
import lunr from 'lunr';
import { getToken } from '../utils/token.utils';
import Loader from '../components/Loader/Loader';
import { CssBaseline } from '@material-ui/core';
import AuthContext from '../context/AuthContext';
import ErrorView from '../views/Error';

const CatalogueDataLoader = ({ children }) => {
  const [catalogueState, setCatalogueState] = useState({});
  const [isLoaded, setLoaded] = useState(false);
  const [isError, setError] = useState(false);
  const { accountState } = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      const courses = await fetch(`${BASE_URL}/courses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${getToken()}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.errorEcode) {
            return res.data;
          }
          throw new Error();
        })
        .catch((err) => {
          setError(true);
        });
      const topics = await fetch(`${BASE_URL}/topics`, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.errorEcode) {
            throw new Error();
          }

          return res.data;
        })
        .catch((err) => {
          setError(true);
        });

      const popularTopics = await fetch(`${BASE_URL}/topics/popular`, {
        method: 'GET',
      })
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

      const index =
        courses &&
        lunr(function () {
          this.ref('courseId');
          this.field('courseTitle');
          this.field('courseDescription');

          courses.forEach(function (course) {
            this.add(course);
          }, this);
        });

      setCatalogueState({
        courses,
        topics,
        popularTopics,
        activeTopics: [],
        search: '',
        index,
        numberDisplayed: courses && courses.length,
      });

      courses && setLoaded(true);
    }
    fetchData();
  }, [accountState]);

  return (
    <>
      <CatalogueContext.Provider value={{ catalogueState, setCatalogueState }}>
        {isError ? (
          <ErrorView />
        ) : isLoaded ? (
          <>{children}</>
        ) : (
          <CssBaseline>
            <Loader placeholder={'Welcome :)'} />
          </CssBaseline>
        )}
      </CatalogueContext.Provider>
    </>
  );
};

export default CatalogueDataLoader;
