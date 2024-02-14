import {
  CourseInfo,
  CourseInfoPermission,
  CourseInfoSections,
  CourseSectionsPermission,
  CourseTopics,
  Section,
} from '../../interfaces/course.interface';
import {
  CourseInfoDB,
  CourseInfoDBPermission,
  CourseInfoDBSections,
  CourseSectionDBPermission,
} from '../../interfaces/database-interfaces/db-courses.interface';

const courseDataPreparator = (course: CourseInfoDB): CourseInfo => {
  const coursePrepared = {
    courseId: course.course_id,
    courseTitle: course.course_title,
    courseDescription: course.course_description,
    courseIsprivate: !!course.course_isprivate,
    courseUploadDate: course.course_upload_date,
    courseDateRestriction: course.course_date_restriction,
    courseOwnerId: course.course_owner_id,
    courseOwnerFirst: course.course_owner_first_name,
    courseOwnerLast: course.course_owner_last_name,
  };

  return {
    ...coursePrepared,
    courseTopics: (JSON.parse(course.course_topics) as CourseTopics[]) || [],
  };
};

const courseSectionsPreparator = (
  course: CourseInfoDBSections
): CourseInfoSections => {
  const courseSectionsInfo = JSON.parse(course.course_sections_info) || [];

  return {
    ...courseDataPreparator(course),
    courseSectionsInfo: courseSectionsInfo.length
      ? courseSectionsInfo.map((section: Section) => ({
          ...section,
          sectionOrder: +section.sectionOrder,
        }))
      : courseSectionsInfo,
    courseLastUpdate: course.course_last_update,
    courseDateRestriction: course.course_date_restriction,
  };
};

const courseSectionPermissionPreparator = (
  course: CourseSectionDBPermission
): CourseSectionsPermission => {
  return {
    ...courseSectionsPreparator(course),
    isEnrolled: !!course.is_enrolled,
  };
};

const courseDataPermissionPreparator = (
  course: CourseInfoDBPermission
): CourseInfoPermission => {
  return {
    ...courseDataPreparator(course),
    isEnrolled: !!course.is_enrolled,
  };
};

export {
  courseDataPreparator,
  courseSectionsPreparator,
  courseDataPermissionPreparator,
  courseSectionPermissionPreparator,
};
