/* eslint-disable camelcase */
interface LessonInfoDB {
  lesson_id: number;
  lesson_title: string;
  lesson_description: string;
  lesson_order: number;
  lesson_upload_date: string;
  lesson_date: string;
  lesson_last_update: string;
  lesson_content: string;
  lesson_isdeleted: 0 | 1;
  lesson_section_id: number;
}

interface LessonInfoDBOwnerId extends LessonInfoDB {
  course_owner_id: number;
}

interface LessonStatsDB {
  user_id: number;
  lesson_id: number;
  lesson_is_completed: boolean;
}

export {
  LessonInfoDB,
  LessonInfoDBOwnerId,
  LessonStatsDB,
};
