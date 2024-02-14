import { topicsData } from '../data/topic.data.js';
import { formatError, formatSuccess } from './common/formatters.js';
import { ApiError, ApiSuccess } from './common/interfaces';
import { serviceErrors } from './service.errors.js';

const getTopics = async (): Promise<ApiSuccess | ApiError> => {
  const result = await topicsData.getTopics();

  if (!(result instanceof Array)) {
    return formatError(serviceErrors.UNKNOWN_ERROR);
  }

  if (!result[0]) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  return formatSuccess(result);
};

const updateCourseTopics = async (
  courseId: number,
  topics: number[]
): Promise<ApiSuccess | ApiError> => {
  const courseTopics = await topicsData.getCourseTopics(courseId);
  const topicList = await topicsData.getTopics();
  const topicIds = topicList.map((item) => item.topicId);

  // checks if req includes non-existing topic Ids
  if (topics.some((item) => topicIds.indexOf(item) < 0)) {
    return formatError(
      serviceErrors.RECORD_NOT_FOUND,
      'Incorrect topicId in request body'
    );
  }

  // checks if the request perfectly matches the existing topics
  if (
    topics.length &&
    topics.every((item) => courseTopics.indexOf(item) >= 0)
  ) {
    return formatSuccess(
      topicList.filter((item) => courseTopics.indexOf(item.topicId) >= 0)
    );
  }

  const toDelete = courseTopics[0]
    ? courseTopics.filter((item) => topics.indexOf(item) < 0)
    : null;
  const toAdd = topics.filter((item) => courseTopics.indexOf(item) < 0);

  const deleted =
    toDelete && (await topicsData.deleteCourseTopics(courseId, toDelete));
  const added = await topicsData.addCourseTopics(courseId, toAdd);

  if (
    (toDelete && deleted.hasOwnProperty('affectedRows')) ||
    (toAdd && added.hasOwnProperty('affectedRows'))
  ) {
    return formatSuccess(
      topicList.filter((item) => topics.indexOf(item.topicId) >= 0)
    );
  }

  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const getMostPopularTopics = async () => {
  const topics = await topicsData.getMostPopularTopics();

  if (!Array.isArray(topics)) {
    return formatError(serviceErrors.UNKNOWN_ERROR);
  }

  return formatSuccess(topics);
};

export const topicServices = {
  getTopics,
  updateCourseTopics,
  getMostPopularTopics,
};
