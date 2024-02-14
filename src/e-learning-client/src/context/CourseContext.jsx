import { createContext } from 'react';

const CourseContext = createContext({
  courseState: {
    course: {},
    sections: {},
    lessons: {},
    teacher: {},
    courseProgress: {},
    announcements: {},
    sortedSections: [],
    sortedLessons: {},
  },
  setCourseState: () => {}
});

export default CourseContext;
