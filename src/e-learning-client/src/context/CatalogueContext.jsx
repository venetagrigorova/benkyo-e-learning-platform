import { createContext } from 'react';

const CatalogueContext = createContext({
  CatalogueState: {
    courses: [],
    topics: [],
    activeTopics: [],
  },
  setCatalogueState: () => {},
});

export default CatalogueContext;
