import {Request, Response} from 'express';
import {NewAnnouncementData, NewAnnouncementDataWithID} from '../interfaces/course.interface.js';
import {CustomRequest} from '../interfaces/request.interface.js';
import {announcesServices} from '../services/announce.services.js';
import {serviceErrors} from '../services/service.errors.js';
import {validationResult} from '../validators/validation-result.js';

const createAnnouncement = async (
  req: CustomRequest<NewAnnouncementData>,
  res: Response): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }

  const newAnnouncementData = {...req.body};

  const createdAnnouncement = await announcesServices.createAnnouncement(newAnnouncementData);

  if (createdAnnouncement.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(createdAnnouncement);
    return;
  }

  res.status(201).send(createdAnnouncement);
  return;
};

const updateAnnouncement = async (
  req: CustomRequest<NewAnnouncementDataWithID>,
  res: Response): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }

  const newAnnouncementDataWithId = {...req.body};

  const updatedAnnouncement = await announcesServices.updateAnnouncement(newAnnouncementDataWithId);

  if (updatedAnnouncement.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(updatedAnnouncement);
    return;
  }

  res.status(200).send(updatedAnnouncement);
  return;
};

const getCourseAnnouncements = async (req: Request, res: Response): Promise<void> => {
  const courseId = Number(req.params.courseId);

  const announcements = await announcesServices.getCourseAnnouncements(courseId);

  if (announcements.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(announcements);
    return;
  }

  res.status(200).send(announcements);
  return;
};

const getAnnouncement = async (req: Request, res: Response): Promise<void> => {
  const courseId = Number(req.params.courseId);
  const announcementId = Number(req.params.announcementId);

  const announcement = await announcesServices.getAnnouncement(announcementId);

  if (announcement.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(announcement);
    return;
  }

  res.status(200).send(announcement);
  return;
};

const deleteAnnouncement = async (req: Request, res: Response): Promise<void> => {
  const announcementId = Number(req.params.announcementId);

  const announcement = await announcesServices.deleteAnnouncement(announcementId);

  if (announcement.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(announcement);
    return;
  }

  res.status(200).send(announcement);
};

export const announcesController = {
  createAnnouncement,
  updateAnnouncement,
  getCourseAnnouncements,
  getAnnouncement,
  deleteAnnouncement,
};
