/* eslint-disable camelcase */
interface CourseInfoDB {
  course_id: number;
  course_title: string;
  course_description: string;
  course_isprivate: 0 | 1;
  course_upload_date: string;
  course_date_restriction: string;
  course_owner_id: number;
  course_owner_first_name: string;
  course_owner_last_name: string;
  course_topics: string;
}

interface CourseInfoDBPermission extends CourseInfoDB {
  is_enrolled: number;
}

interface AnnouncementInfoDB {
  announce_id: number;
  announce_title: string;
  announce_content: string;
  announce_uploaded_date: Date;
  announce_course_id: number;
}

interface CourseInfoDBSections extends CourseInfoDB {
  course_sections_info: string;
  course_last_update: string;
}

interface CourseSectionDBPermission extends CourseInfoDBSections {
  is_enrolled: number;
}

type DeleteCourseInfo = {
  courseOwnerId: number;
  courseId: number;
};

type CourseOwnerInfo = DeleteCourseInfo;

type CoursePrivacyInfo = {
  courseId: number;
  courseIsprivate: number;
};

type CourseOwnerInfoDB = {
  course_owner_id: number;
  course_id: number;
};

type CoursePrivacyInfoDB = {
  course_id: number;
  course_isprivate: number;
};

interface CourseProgressDB {
  user_id: number;
  course_id: number;
  complete_lessons: number;
  complete_lesson_ids: string;
}

export {
  CourseInfoDB,
  CourseInfoDBPermission,
  AnnouncementInfoDB,
  CourseInfoDBSections,
  DeleteCourseInfo,
  CourseOwnerInfo,
  CourseOwnerInfoDB,
  CourseProgressDB,
  CoursePrivacyInfoDB,
  CoursePrivacyInfo,
  CourseSectionDBPermission,
};
