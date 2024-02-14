import {
  LessonInfo,
  LessonInfoCourseOwnerId,
} from '../../interfaces/lesson.info.interface';
import {
  LessonInfoDB,
  LessonInfoDBOwnerId,
} from '../../interfaces/database-interfaces/db-lessons.interface';

const lessonDataPreparator = (lesson: LessonInfoDB): LessonInfo => {
  const lessonPrepared = {
    lessonId: lesson.lesson_id,
    lessonTitle: lesson.lesson_title,
    lessonDescription: lesson.lesson_description,
    lessonOrder: lesson.lesson_order,
    lessonUploadDate: lesson.lesson_upload_date,
    lessonDate: lesson.lesson_date,
    lessonLastUpdate: lesson.lesson_last_update,
    lessonContent: JSON.parse(lesson.lesson_content),
    lessonIsDeleted: lesson.lesson_isdeleted,
    lessonSectionId: lesson.lesson_section_id,
  };

  return lessonPrepared;
};

const lessonOwnerIdPreparator = (
  lesson: LessonInfoDBOwnerId
): LessonInfoCourseOwnerId => {
  return {
    ...lessonDataPreparator(lesson),
    courseOwnerId: lesson.course_owner_id,
  };
};

export { lessonDataPreparator, lessonOwnerIdPreparator };
