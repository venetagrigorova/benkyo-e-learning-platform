import { Request, Response } from 'express';
import { TopicSearchQuery } from '../interfaces/topic.interface.js';
import { formatError } from '../services/common/formatters.js';
import { serviceErrors } from '../services/service.errors.js';
import { topicServices } from '../services/topics.services.js';
import { validationResult } from '../validators/validation-result.js';

const getTopics = async (req: Request, res: Response): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }
  const topics = await topicServices.getTopics();

  if (topics.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(200).send(topics);
    return;
  }

  if (topics.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(topics);
    return;
  }

  res.status(200).send(topics);
};

const updateCourseTopics = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }

  const result = await topicServices.updateCourseTopics(
    +req.params.courseId,
    req.body.topics
  );

  if (result.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(result);
  }

  if (result.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(result);
  }

  res.status(200).send(result);
};

const getMostPopularTopics = async (req: Request, res: Response) => {
  const result = await topicServices.getMostPopularTopics();

  if (result.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(result);
  }

  res.status(200).send(result);
};

export const topicController = {
  getTopics,
  updateCourseTopics,
  getMostPopularTopics,
};
