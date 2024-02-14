import { TokenPayloadInterface } from './../interfaces/token.interface';
import { Request, Response } from 'express';
import {
  NewLessonData,
  UpdateLessonData,
} from '../interfaces/lesson.info.interface.js';
import { CustomRequest } from '../interfaces/request.interface.js';
import { lessonsServices } from '../services/lessons.services.js';
import { serviceErrors } from '../services/service.errors.js';
import { validationResult } from '../validators/validation-result.js';

const createLesson = async (
  req: CustomRequest<NewLessonData>,
  res: Response
): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }
  const courseId = +req.params.courseId;
  const newLessonData = {
    ...req.body,
    lessonSectionId: +req.params.sectionId,
  };

  const createdLesson = await lessonsServices.createLesson(
    newLessonData,
    courseId
  );

  if (createdLesson.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(createdLesson);
    return;
  }

  res.status(200).send(createdLesson);
  return;
};

const updateLesson = async (
  req: CustomRequest<UpdateLessonData>,
  res: Response
): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }
  const user = req.user as TokenPayloadInterface;

  const updatedLesson = await lessonsServices.updateLesson({
    lessonId: +req.params.lessonId,
    ...req.body,
    courseOwnerId: user.userId,
  });

  if (updatedLesson.errorCode === serviceErrors.OPERATION_NOT_PERMITTED) {
    res.status(401).send(updatedLesson);
    return;
  }

  if (updatedLesson.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(updatedLesson);
    return;
  }

  if (updatedLesson.errorCode === serviceErrors.DUPLICATE_RECORD) {
    res.status(409).send(updatedLesson);
    return;
  }

  if (updatedLesson.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(updatedLesson);
    return;
  }

  res.status(200).send(updatedLesson);
  return;
};

const getLesson = async (req: Request, res: Response): Promise<void> => {
  const lessonId = Number(req.params.lessonId);

  const lesson = await lessonsServices.getLesson(lessonId);

  if (lesson.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(lesson);
    return;
  }

  res.status(200).send(lesson);
  return;
};

const getLessons = async (req: Request, res: Response): Promise<void> => {
  const courseId = Number(req.params.courseId);
  const sectionId = Number(req.params.sectionId);

  const lesson = await lessonsServices.getLessons(courseId, sectionId);

  if (lesson.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(lesson);
    return;
  }

  res.status(200).send(lesson);
  return;
};

const deleteLesson = async (req: Request, res: Response): Promise<void> => {
  const courseId = Number(req.params.courseId);
  const lessonId = Number(req.params.lessonId);
  const user = req.user as TokenPayloadInterface;

  const result = await lessonsServices.deleteLesson({
    courseId,
    lessonId,
    courseOwnerId: user.userId,
  });

  if (result.errorCode === serviceErrors.OPERATION_NOT_PERMITTED) {
    res.status(401).send(result);
    return;
  }

  if (result.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(result);
    return;
  }

  if (result.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(result);
    return;
  }

  res.status(200).send(result);
  return;
};


const addLessonStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as TokenPayloadInterface;
  const lessonId = +req.params.lessonId;
  const result = await lessonsServices.addLessonStats(user.userId, lessonId);

  if (result.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(404).json(result);
    return;
  }

  res.status(200).json(result);
  return;
};


const deleteLessonStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as TokenPayloadInterface;
  const lessonId = +req.params.lessonId;
  const result = await lessonsServices.deleteLessonStats(user.userId, lessonId);

  if (result.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(404).json(result);
    return;
  }

  res.status(200).json(result);
  return;
};

export const lessonsController = {
  createLesson,
  updateLesson,
  getLesson,
  getLessons,
  deleteLesson,
  addLessonStats,
  deleteLessonStats
};
