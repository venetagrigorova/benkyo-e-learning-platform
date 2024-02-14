import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const GuardedRoute = ({ component: Component, user, teacher, ...rest }) => {
  const { accountState } = useContext(AuthContext);
  const isLoggedIn = Object.keys(accountState).length !== 0;

  return (
    <Route
      {...rest}
      render={(props) =>
        (user && isLoggedIn) ||
        (teacher && isLoggedIn && accountState.role === 'teacher') ? (
          <Component {...props} />
        ) : (
          <Redirect to='/' />
        )
      }
    />
  );
};

export default GuardedRoute;
