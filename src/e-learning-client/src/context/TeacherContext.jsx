import { createContext } from 'react';

const TeacherContext = createContext({
  CatalogueState: {
    courses: [],
    isLoaded: false,
  },
  setCatalogueState: () => {},
});

export default TeacherContext;
