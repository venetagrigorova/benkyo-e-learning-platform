import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import { getDecodedToken } from './utils/token.utils';
import { ThemeProvider } from '@material-ui/core';
import mainTheme from './themes/main.theme';
import Home from './views/Home';
import CatalogueDataLoader from './providers/CatalogueDataLoader';
import Catalogue from './views/Catalogue';
import CourseDataLoader from './providers/CourseDataLoader';
import Course from './views/Course';
import Section from './views/Section';
import Lesson from './views/Lesson';
import TeacherDataLoader from './providers/TeacherDataLoader';
import TeacherDashboard from './views/TeacherDashboard';
import Profile from './views/Profile';
import UserDataLoader from './providers/UserDataLoader';
import GuardedRoute from './providers/guards/GuardedRoute';
import MyCourses from './views/MyCourses';
import DocumentationView from './views/DocumentationView';

function App() {
  const [accountState, setAccountState] = useState(getDecodedToken());

  return (
    <Router>
      <AuthContext.Provider value={{ accountState, setAccountState }}>
        <Switch>
          <ThemeProvider theme={mainTheme}>
            <CatalogueDataLoader>
              <GuardedRoute user path={['/mycourses']} component={MyCourses} />

              <TeacherDataLoader>
                <Route exact path='/' component={Home} />
                <Route
                  path={['/catalogue', '/catalogue?title=?']}
                  component={Catalogue}
                />

                <GuardedRoute
                  teacher
                  path={[
                    '/dashboard/courses/:courseId/sections/:sectionId/lessons/new',
                    '/dashboard/courses/:courseId/sections/:sectionId/lessons/:lessonId',
                    '/dashboard/courses/:courseId/sections/:sectionId',
                    '/dashboard/courses/:courseId',
                    '/dashboard',
                  ]}
                  component={TeacherDashboard}
                />
              </TeacherDataLoader>

              <CourseDataLoader
                path={[
                  '/courses/:courseId/sections/:sectionId/lessons/:lessonId',
                  '/courses/:courseId/sections/:sectionId',
                  '/courses/:courseId',
                ]}
              >
                <GuardedRoute
                  user
                  exact
                  path='/courses/:courseId/sections/:sectionId/lessons/:lessonId'
                  component={Lesson}
                />
                <GuardedRoute
                  user
                  exact
                  path='/courses/:courseId/sections/:sectionId'
                  component={Section}
                />
                <GuardedRoute
                  user
                  exact
                  path='/courses/:courseId'
                  component={Course}
                />
              </CourseDataLoader>

              <UserDataLoader>
                <GuardedRoute user path='/profile' component={Profile} />
              </UserDataLoader>

              <Route exact path='/api/doc' component={DocumentationView} />
            </CatalogueDataLoader>
          </ThemeProvider>
        </Switch>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
