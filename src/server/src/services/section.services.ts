import { sectionData } from '../data/section.data.js';
import { DeleteSectionInfo } from '../interfaces/database-interfaces/db-sections.interface.js';
import {
  KeysUpdateSectionData,
  NewSectionData,
  UpdateSectionData,
} from '../interfaces/section.interface.js';
import { formatError, formatSuccess } from './common/formatters.js';
import { ApiError, ApiSuccess } from './common/interfaces.js';
import { serviceErrors } from './service.errors.js';
import { lessonsServices } from './lessons.services.js';
import { InsertionReturn } from '../interfaces/database-interfaces/returns.interface.js';

const getSectionById = async (
  sectionId: number
): Promise<ApiSuccess | ApiError> => {
  const result = await sectionData.getSectionById(sectionId);

  if (!result) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  return formatSuccess(result);
};

const getSectionsByCourseId = async (
  courseId: number
): Promise<ApiSuccess | ApiError> => {
  const result = await sectionData.getSectionsByCourseId(courseId);

  if (!result) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  return formatSuccess(result);
};

const createSection = async (
  newSectionData: NewSectionData
): Promise<ApiSuccess | ApiError> => {
  const result = await sectionData.createSection(newSectionData);
  if (result.sectionId) {
    return formatSuccess(result);
  }
  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const updateSection = async (
  updatedSectionData: UpdateSectionData
): Promise<ApiSuccess | ApiError> => {
  const previousVersion = await sectionData.getSectionById(
    updatedSectionData.sectionId
  );

  if (!previousVersion) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  if (previousVersion.sectionOwnerId !== updatedSectionData.sectionOwnerId) {
    return formatError(serviceErrors.OPERATION_NOT_PERMITTED);
  }

  const isIdentical = (
    Object.keys(updatedSectionData) as KeysUpdateSectionData[]
  ).reduce((acc, key) => {
    if (updatedSectionData[key] != previousVersion[key]) {
      return false;
    }

    return acc;
  }, true);
  if (isIdentical) {
    return formatError(serviceErrors.DUPLICATE_RECORD);
  }

  const newSectionData = await sectionData.updateSection(updatedSectionData);

  if (typeof newSectionData === 'number') {
    return formatError(newSectionData);
  }

  if (typeof newSectionData !== 'number' && newSectionData.sectionId) {
    return formatSuccess({
      ...previousVersion,
      ...newSectionData,
    });
  }

  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const deleteSection = async (
  deleteInfo: DeleteSectionInfo
): Promise<ApiSuccess | ApiError> => {
  const section = await sectionData.getSectionById(deleteInfo.sectionId);

  if (!section) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  const lessonsIds = section.sectionLessonsInfo.map((l) => l.lessonId);

  if (lessonsIds.length) {
    const lessonsDelete = await Promise.all(
      lessonsIds.map(async (id) => {
        const result = (await lessonsServices.deleteLesson({
          lessonId: id,
          courseOwnerId: section.sectionOwnerId,
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

    if (!lessonsDelete) {
      return formatError(serviceErrors.UNKNOWN_ERROR);
    }
  }

  if (section.sectionOwnerId !== deleteInfo.sectionOwnerId) {
    return formatError(serviceErrors.OPERATION_NOT_PERMITTED);
  }

  const result = (await sectionData.deleteSection({
    ...section,
    courseId: deleteInfo.courseId,
  })) as InsertionReturn;

  if (!result.affectedRows) {
    return formatError(serviceErrors.UNKNOWN_ERROR);
  }

  return formatSuccess(result);
};

export const sectionServices = {
  getSectionById,
  getSectionsByCourseId,
  createSection,
  updateSection,
  deleteSection,
};
