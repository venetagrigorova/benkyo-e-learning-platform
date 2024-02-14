import { UserRoles } from '../common/user-roles.enum.js';
import { coursesData } from '../data/course.data.js';
import {
  KeysUpdateCourseData,
  NewCourseData,
  PermissionResult,
  UpdateCourseData,
} from '../interfaces/course.interface.js';
import { DeleteCourseInfo } from '../interfaces/database-interfaces/db-courses.interface.js';
import { InsertionReturn } from '../interfaces/database-interfaces/returns.interface.js';
import { formatError, formatSuccess } from './common/formatters.js';
import { ApiError, ApiSuccess, Data } from './common/interfaces.js';
import { sectionServices } from './section.services.js';
import { serviceErrors } from './service.errors.js';

const getCourseById = async (
  courseId: number,
  userId?: number
): Promise<ApiSuccess | ApiError> => {
  const result = await coursesData.getCourseById(courseId, userId);

  if (!result) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  return formatSuccess(result);
};

const getCourseOwner = async (
  courseId: number
): Promise<ApiSuccess | ApiError> => {
  const result = await coursesData.getCourseOwnerId(courseId);

  if (!result) {
    return formatError(serviceErrors.UNKNOWN_ERROR);
  }

  if (!result.courseOwnerId) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  return formatSuccess(result);
};

const getCourseAudience = async (
  courseId: number
): Promise<ApiSuccess | ApiError> => {
  const result = await coursesData.getCourseAudience(courseId);

  if (!result) {
    return formatError(serviceErrors.UNKNOWN_ERROR);
  }

  if (!result.courseId) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  return formatSuccess(result);
};

const getOwnCourses = async (
  userId: number
): Promise<ApiSuccess | ApiError> => {
  const result = await coursesData.getOwnCourses(userId);

  if (result instanceof Array) {
    return formatSuccess(result);
  }

  return formatError(serviceErrors.UNKNOWN_ERROR);
};

// const getAllCourses = async (): Promise<ApiSuccess | ApiError> => {
//   const result = await coursesData.getAllCourses();

//   if (result instanceof Array) {
//     return formatSuccess(result);
//   }

//   return formatError(serviceErrors.UNKNOWN_ERROR);
// };

const getCoursesRegisteredUser = async (
  userId: number
): Promise<ApiSuccess | ApiError> => {
  const result = await coursesData.getCoursesRegisteredUser(userId);

  if (result instanceof Array) {
    return formatSuccess(result);
  }
  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const getPublicCourses = async (): Promise<ApiSuccess | ApiError> => {
  const result = await coursesData.getPublicCourses();

  if (result instanceof Array) {
    return formatSuccess(result);
  }

  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const createCourse = async (
  newCourseData: NewCourseData
): Promise<ApiSuccess | ApiError> => {
  const result = await coursesData.createCourse(newCourseData);
  if (result.courseId) {
    return formatSuccess(result);
  }
  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const updateCourse = async (
  updatedCourseData: UpdateCourseData
): Promise<ApiSuccess | ApiError> => {
  const previousVersion = await coursesData.getCourseById(
    updatedCourseData.courseId
  );

  if (!previousVersion) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  if (previousVersion.courseOwnerId !== updatedCourseData.courseOwnerId) {
    return formatError(serviceErrors.OPERATION_NOT_PERMITTED);
  }

  const isIdentical = (
    Object.keys(updatedCourseData) as KeysUpdateCourseData[]
  ).reduce((acc, key) => {
    if (updatedCourseData[key] != previousVersion[key]) {
      return false;
    }
    return acc;
  }, true);
  if (isIdentical) {
    return formatError(serviceErrors.NO_MODIFICATION);
  }

  const newCourseData = await coursesData.updateCourse(updatedCourseData);

  if (typeof newCourseData === 'number') {
    return formatError(serviceErrors.NO_MODIFICATION);
  }

  if (typeof newCourseData !== 'number' && newCourseData.courseId) {
    return formatSuccess({
      ...previousVersion,
      ...newCourseData,
    } as Data);
  }

  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const deleteCourse = async (
  deleteInfo: DeleteCourseInfo
): Promise<ApiSuccess | ApiError> => {
  const course = await coursesData.getCourseById(deleteInfo.courseId);

  if (!course) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  const sectionsIds = course.courseSectionsInfo.map((s) => s.sectionId);

  if (sectionsIds.length) {
    const sectionsDelete = await Promise.all(
      sectionsIds.map(async (id) => {
        const result = (await sectionServices.deleteSection({
          sectionId: id,
          sectionOwnerId: course.courseOwnerId,
          courseId: deleteInfo.courseId,
        })) as ApiSuccess | ApiError;

        return result;
      })
    ).then((result) => {
      if (
        result.reduce((acc, result) => {
          const data = result.data as InsertionReturn;

          return !!data.affectedRows && acc;
        }, true)
      ) {
        return true;
      }

      return false;
    });

    if (!sectionsDelete) {
      return formatError(serviceErrors.UNKNOWN_ERROR);
    }
  }

  if (course.courseOwnerId !== deleteInfo.courseOwnerId) {
    return formatError(serviceErrors.OPERATION_NOT_PERMITTED);
  }

  const result = (await coursesData.deleteCourse(course)) as InsertionReturn;

  if (!result.affectedRows) {
    return formatError(serviceErrors.UNKNOWN_ERROR);
  }

  return formatSuccess(result);
};

const getCourseProgress = async (
  userId: number,
  courseId: number
): Promise<ApiSuccess | ApiError> => {
  const courseStats = await coursesData.getCourseProgress(userId, courseId);

  if (!courseStats) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }
  return formatSuccess(courseStats);
};

const enrollStudents = async (
  userIds: number[],
  courseId: number
): Promise<ApiError | ApiSuccess> => {
  const result = await Promise.all(
    userIds.map(async (userId) => {
      const isUserEnrolled = await coursesData.isUserEnrolled(userId, courseId);
      if (isUserEnrolled) {
        return userId;
      } else {
        const enrolledStudent = await coursesData.enrollStudent(
          userId,
          courseId
        );
        return enrolledStudent;
      }
    })
  ).then((results) => {
    const ok = [] as number[];
    const failed = [] as number[];
    results.forEach((result) => {
      if (typeof result === 'number') {
        failed.push(result);
      } else {
        ok.push(result.userId);
      }
    });
    return { ok, failed } as PermissionResult;
  });

  if (result.failed.length && !result.ok.length) {
    return formatError(serviceErrors.DUPLICATE_RECORD, result);
  }
  return formatSuccess(result);
};

const unenrollStudents = async (
  userIds: number[],
  courseId: number
): Promise<ApiError | ApiSuccess> => {
  const result = await Promise.all(
    userIds.map(async (userId) => {
      const isUserEnrolled = await coursesData.isUserEnrolled(userId, courseId);
      if (!isUserEnrolled) {
        return userId;
      } else {
        const unenrolledStudent = await coursesData.unenrollStudent(
          userId,
          courseId
        );
        return unenrolledStudent;
      }
    })
  ).then((results) => {
    const ok = [] as number[];
    const failed = [] as number[];

    results.forEach((result) => {
      if (typeof result === 'number') {
        failed.push(result);
      } else {
        ok.push(result.userId);
      }
    });
    return { ok, failed } as PermissionResult;
  });

  if (result.failed.length && !result.ok.length) {
    return formatError(serviceErrors.UNKNOWN_ERROR, result);
  }
  return formatSuccess(result);
};

const selfEnroll = async (
  userId: number,
  courseId: number,
  role: string
): Promise<ApiSuccess | ApiError> => {
  const course = await coursesData.getCourseAudience(courseId);

  if (!course) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  if (course.courseIsprivate && role === UserRoles.STUDENT) {
    return formatError(serviceErrors.OPERATION_NOT_PERMITTED);
  }

  const result = await coursesData.selfEnroll(userId, courseId);

  if (result.affectedRows === 1) {
    return formatSuccess(result);
  }
  if (result.affectedRows === 0) {
    return formatError(serviceErrors.DUPLICATE_RECORD);
  }

  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const selfUnenroll = async (
  userId: number,
  courseId: number,
  role: string
): Promise<ApiSuccess | ApiError> => {
  const course = await coursesData.getCourseAudience(courseId);

  if (!course) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  if (course.courseIsprivate && role === UserRoles.STUDENT) {
    return formatError(serviceErrors.OPERATION_NOT_PERMITTED);
  }

  const result = await coursesData.selfUnenroll(userId, courseId);

  if (result.affectedRows === 1) {
    return formatSuccess(result);
  }
  if (result.affectedRows === 0) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const getEnrolledStudents = async (
  courseId: number
): Promise<ApiError | ApiSuccess> => {
  const result = await coursesData.getEnrolledStudents(courseId);

  if (!Array.isArray(result)) {
    return formatError(serviceErrors.UNKNOWN_ERROR);
  }

  return formatSuccess(result);
};

const getUnenrolledStudents = async (
  courseId: number
): Promise<ApiError | ApiSuccess> => {
  const result = await coursesData.getUnenrolledStudents(courseId);

  if (result[0]) {
    return formatSuccess(result);
  }

  return formatError(serviceErrors.RECORD_NOT_FOUND);
};

const getEnrollmentRecord = async (
  userId: number,
  courseId: number
): Promise<ApiSuccess | ApiError> => {
  const isEnrolled = await coursesData.getEnrollmentRecord(userId, courseId);

  if (!isEnrolled) {
    return formatError(serviceErrors.UNKNOWN_ERROR);
  }

  if (!isEnrolled.userId) {
    return formatError(serviceErrors.RECORD_NOT_FOUND, isEnrolled);
  }

  return formatSuccess(isEnrolled);
};

export const coursesServices = {
  getCourseById,
  // getAllCourses,
  getOwnCourses,
  getCourseOwner,
  getCoursesRegisteredUser,
  getPublicCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseProgress,
  enrollStudents,
  unenrollStudents,
  selfEnroll,
  selfUnenroll,
  getEnrolledStudents,
  getUnenrolledStudents,
  getEnrollmentRecord,
  getCourseAudience,
};
