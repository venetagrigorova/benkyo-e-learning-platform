/* eslint-disable camelcase */
interface LessonInfo {
  lessonId: number;
  lessonTitle: string;
  lessonDescription: string;
  lessonOrder: number;
  lessonUploadDate: string;
  lessonDate: string;
  lessonContent: string;
  lessonIsDeleted: 1 | 0;
  lessonSectionId: number;
}

interface LessonInfoCourseOwnerId extends LessonInfo {
  courseOwnerId: number;
}

interface NewLessonData {
  lessonTitle: string;
  lessonDescription: string;
  lessonOrder: number;
  lessonDate?: string;
  lessonContent: string;
  lessonSectionId: number;
}

interface NewLessonDataWithID extends NewLessonData {
  lessonId: number;
}

interface UpdateLessonData {
  lessonTitle?: string;
  lessonDescription?: string;
  lessonOrder?: number;
  lessonDate?: string;
  lessonContent?: string;
  lessonSectionId?: number;
}

interface UpdateLessonDataWithID extends UpdateLessonData {
  lessonId: number;
  courseOwnerId: number;
}

type KeysUpdateLessonData =
  | 'lessonId'
  | 'lessonTitle'
  | 'lessonDescription'
  | 'lessonOrder'
  | 'lessonDate'
  | 'lessonContent'
  | 'lessonSectionId'
  | 'courseOwnerId';

type DeleteLessonInfo = {
  courseId: number;
  lessonId: number;
  courseOwnerId: number;
};


export {
  LessonInfo,
  LessonInfoCourseOwnerId,
  NewLessonData,
  NewLessonDataWithID,
  UpdateLessonData,
  UpdateLessonDataWithID,
  KeysUpdateLessonData,
  DeleteLessonInfo,
};
