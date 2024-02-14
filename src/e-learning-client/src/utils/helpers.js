import { matchPath } from 'react-router-dom';

export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  const html = document.documentElement;
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom - 1 <= (window.innerHeight || html.clientHeight) &&
    rect.right - 1 <= (window.innerWidth || html.clientWidth)
  );
};

export const getCourseIdIfValidPath = (currentPath, allowedPaths) => {
  let courseId = null;
  allowedPaths.forEach((path) => {
    const match = matchPath(currentPath, {
      path: path,
    });
    if (match) {
      courseId = match.params.courseId;
    }
  });
  return courseId;
};

export const getFirstFilteredCourse = (array, courseId) =>
  array.filter((item) => +item.courseId === +courseId)[0];

export const getFirstFilteredSection = (array, sectionId) =>
  array.filter((item) => +item.sectionId === +sectionId)[0];

export const replaceSectionInCourse = (course, section) => ({
  ...course,
  courseSectionsInfo: [
    ...course.courseSectionsInfo.filter(
      (item) => item.sectionId !== section.sectionId
    ),
    section,
  ],
});

export const parseHTML = (htmlString) => {
  const parsedHTML = (() => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = htmlString;
    return wrapper.firstChild;
  })();
  return parsedHTML;
};

export const getInfoHTML = (htmlString) => {
  const parsedHTML = parseHTML(htmlString);
  const title = parsedHTML.getAttribute('title');
  const order = +parsedHTML.getAttribute('order');
  const orientation = parsedHTML.getAttribute('orientation');

  return { title, order, orientation };
};
