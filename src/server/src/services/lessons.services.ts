import { coursesData } from './../data/course.data.js';
import { lessonsData } from '../data/lesson.data.js';
import { ApiSuccess, ApiError, Data } from './common/interfaces';
import { formatError, formatSuccess } from './common/formatters.js';
import { serviceErrors } from './service.errors.js';
import {
  KeysUpdateLessonData,
  NewLessonData,
  UpdateLessonDataWithID,
  DeleteLessonInfo,
} from '../interfaces/lesson.info.interface.js';

const createLesson = async (
  newLessonData: NewLessonData,
  courseId: number
): Promise<ApiSuccess | ApiError> => {
  const result = await lessonsData.createLesson({
    ...newLessonData,
    lessonContent: JSON.stringify(newLessonData.lessonContent),
  });

  if (result.lessonId) {
    return formatSuccess(result);
  }
  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const updateLesson = async (
  updateLessonData: UpdateLessonDataWithID
): Promise<ApiSuccess | ApiError> => {
  const previousVersion = await lessonsData.getLesson(
    updateLessonData.lessonId
  );

  if (!previousVersion) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  const isIdentical = (
    Object.keys(updateLessonData) as KeysUpdateLessonData[]
  ).reduce((acc, key) => {
    if (updateLessonData[key] != previousVersion[key]) {
      return false;
    }

    return acc;
  }, true);

  if (isIdentical) {
    return formatError(serviceErrors.DUPLICATE_RECORD);
  }

  const result = updateLessonData.lessonContent
    ? await lessonsData.updateLesson({
        ...updateLessonData,
        lessonContent: JSON.stringify(updateLessonData.lessonContent as string),
      })
    : await lessonsData.updateLesson(updateLessonData);

  if (result) {
    const newLessonData = {
      ...previousVersion,
      ...result,
    };

    if (updateLessonData.lessonContent) {
      newLessonData.lessonContent = updateLessonData.lessonContent;
    }
    return formatSuccess(newLessonData);
  }

  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const getLesson = async (lessonId: number): Promise<ApiSuccess | ApiError> => {
  const result = await lessonsData.getLesson(lessonId);

  if (result) {
    return formatSuccess(result);
  }
  return formatError(serviceErrors.RECORD_NOT_FOUND);
};

const getLessons = async (
  courseId: number,
  sectionId: number
): Promise<ApiSuccess | ApiError> => {
  const result = await lessonsData.getLessons(courseId, sectionId);

  if (result) {
    return formatSuccess(result);
  }
  return formatError(serviceErrors.RECORD_NOT_FOUND);
};

const deleteLesson = async (
  deleteInfo: DeleteLessonInfo
): Promise<ApiSuccess | ApiError> => {
  const lesson = await lessonsData.getLesson(deleteInfo.lessonId);

  if (!lesson) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  if (lesson.courseOwnerId !== deleteInfo.courseOwnerId) {
    return formatError(serviceErrors.OPERATION_NOT_PERMITTED);
  }

  const result = await lessonsData.deleteLesson(deleteInfo.lessonId);

  if (result) {
    const enrolledStudents = await coursesData.getEnrolledStudents(
      deleteInfo.courseId
    );
    const classLessonStats = await Promise.all(
      enrolledStudents.map(async (enrolledStudent) => {
        const studentLessonStats = await lessonsData.deleteLessonStats(
          enrolledStudent.userId,
          deleteInfo.lessonId
        );
        return studentLessonStats;
      })
    )
    return formatSuccess(result);
  }
  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const addLessonStats = async (
  userId: number,
  lessonId: number
): Promise<ApiSuccess | ApiError> => {
  const result = await lessonsData.addLessonStats(userId, lessonId);

  if (result) {
    return formatSuccess(result);
  }
  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const deleteLessonStats = async (
  userId: number,
  lessonId: number
): Promise<ApiSuccess | ApiError> => {
  const result = await lessonsData.deleteLessonStats(userId, lessonId);


  if (result) {
    return formatSuccess(result);
  }
  return formatError(serviceErrors.UNKNOWN_ERROR);
};

export const lessonsServices = {
  createLesson,
  updateLesson,
  getLesson,
  getLessons,
  deleteLesson,
  addLessonStats,
  deleteLessonStats,
};
