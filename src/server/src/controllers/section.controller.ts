import { Request, Response } from 'express';
import { CustomRequest } from '../interfaces/request.interface.js';
import {
  NewSectionData,
  UpdateSectionData,
} from '../interfaces/section.interface.js';
import { TokenPayloadInterface } from '../interfaces/token.interface.js';
import { sectionServices } from '../services/section.services.js';
import { serviceErrors } from '../services/service.errors.js';
import { validationResult } from '../validators/validation-result.js';

const getSection = async (
  req: CustomRequest<NewSectionData>,
  res: Response
): Promise<void> => {
  const section = await sectionServices.getSectionById(+req.params.sectionId);

  if (section.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(section);
    return;
  }

  res.status(200).send(section);
};

const getSections = async (req: Request, res: Response): Promise<void> => {
  const sections = await sectionServices.getSectionsByCourseId(
    +req.params.courseId
  );

  if (sections.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(sections);
    return;
  }

  res.status(200).send(sections);
};

const createSection = async (
  req: CustomRequest<NewSectionData>,
  res: Response
): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }

  const user = req.user as TokenPayloadInterface;
  const newSectionData = {
    ...req.body,
    sectionOwnerId: user.userId,
    sectionCourseId: +req.params.courseId,
  };

  const createdSection = await sectionServices.createSection(newSectionData);

  if (createdSection.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(createdSection);
    return;
  }

  res.status(200).send(createdSection);
  return;
};

const updateSection = async (
  req: CustomRequest<UpdateSectionData>,
  res: Response
): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }

  const user = req.user as TokenPayloadInterface;
  const updatedSection = await sectionServices.updateSection({
    ...req.body,
    sectionId: +req.params.sectionId,
    sectionOwnerId: user.userId,
  });

  if (updatedSection.errorCode === serviceErrors.OPERATION_NOT_PERMITTED) {
    res.status(403).send(updatedSection);
    return;
  }

  if (updatedSection.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(updatedSection);
    return;
  }

  if (updatedSection.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(updatedSection);
    return;
  }

  res.status(200).send(updatedSection);
  return;
};

const deleteSection = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as TokenPayloadInterface;
  const result = await sectionServices.deleteSection({
    sectionOwnerId: user.userId,
    sectionId: +req.params.sectionId,
    courseId: +req.params.courseId,
  });
  if (result.errorCode === serviceErrors.OPERATION_NOT_PERMITTED) {
    res.status(403).send(result);
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

export const sectionController = {
  getSection,
  getSections,
  createSection,
  updateSection,
  deleteSection,
};
