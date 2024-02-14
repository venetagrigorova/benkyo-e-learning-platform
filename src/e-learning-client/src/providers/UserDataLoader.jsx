/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { BASE_URL } from '../common/strings.enums';
import AuthContext from '../context/AuthContext';
import Loader from '../components/Loader/Loader';
import { CssBaseline } from '@material-ui/core';
import UserContext from '../context/UserContext';
import { Redirect, useLocation } from 'react-router-dom';
import ErrorView from '../views/Error';

const UserDataLoader = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const { accountState } = useContext(AuthContext);
  const [userState, setUserState] = useState({});
  const [isLoaded, setLoaded] = useState(false);
  const [isError, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoaded(false);
      const user = await fetch(`${BASE_URL}/users/${accountState.userId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.errorCode) {
            throw new Error();
          }
          return res.data[0];
        })
        .catch((err) => {
          setError(true);
        });

      setUserState({
        ...user,
      });
      setLoaded(true);
    }

    if (
      accountState &&
      Object.keys(accountState).length !== 0 &&
      currentPath === '/profile'
    ) {
      fetchData();
    } else {
      setLoaded(true);
    }
  }, [accountState, currentPath]);

  return (
    <>
      <UserContext.Provider value={{ userState, setUserState }}>
        {isError ? (
          <ErrorView />
        ) : isLoaded ? (
          <>{children}</>
        ) : (
          <CssBaseline>
            <Loader placeholder={'Your account is loading :)'} />
          </CssBaseline>
        )}
      </UserContext.Provider>
    </>
  );
};
export default UserDataLoader;
