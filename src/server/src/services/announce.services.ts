import {announcesData} from '../data/announce.data.js';
import {NewAnnouncementData, NewAnnouncementDataWithID} from '../interfaces/course.interface.js';
import {formatError, formatSuccess} from './common/formatters.js';
import {ApiError, ApiSuccess} from './common/interfaces.js';
import {serviceErrors} from './service.errors.js';

const createAnnouncement = async (newAnnouncementData: NewAnnouncementData): Promise<ApiSuccess | ApiError> => {
  const result = await announcesData.createAnnouncement(newAnnouncementData);

  if (result.announcementId) {
    return formatSuccess(result);
  }
  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const updateAnnouncement = async (newAnnouncementDataWithId: NewAnnouncementDataWithID): Promise<ApiSuccess | ApiError> => {
  const result = await announcesData.updateAnnouncement(newAnnouncementDataWithId);

  if (result.announcementId) {
    return formatSuccess(result);
  }
  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const getCourseAnnouncements = async (courseId: number): Promise<ApiSuccess | ApiError> => {
  const result = await announcesData.getCourseAnnouncements(courseId);

  if (result instanceof Array) {
    return formatSuccess(result);
  }
  return formatError(serviceErrors.RECORD_NOT_FOUND);
};

const getAnnouncement = async (announcementId: number): Promise<ApiSuccess | ApiError> => {
  const result = await announcesData.getAnnouncement(announcementId);

  if (result) {
    return formatSuccess(result);
  }
  return formatError(serviceErrors.RECORD_NOT_FOUND);
};

const deleteAnnouncement = async (announcementId: number): Promise<ApiSuccess | ApiError> => {
  const result = await announcesData.deleteAnnouncement(announcementId);

  if (result.announcementId) {
    return formatSuccess(result);
  }
  return formatError(serviceErrors.RECORD_NOT_FOUND);
};

export const announcesServices = {
  createAnnouncement,
  updateAnnouncement,
  getCourseAnnouncements,
  getAnnouncement,
  deleteAnnouncement,
};
