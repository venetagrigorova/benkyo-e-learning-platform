import CategoryChips from '../../../CatalogueCourses/CategoryChips/CategoryChips';

const CourseTopics = ({ courseTopics }) => {
  return courseTopics.length ? (
    <CategoryChips courseTopics={courseTopics} />
  ) : (
    <></>
  );
};

export default CourseTopics;
