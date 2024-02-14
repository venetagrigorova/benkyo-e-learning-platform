import { Schema } from 'express-validator';
import { formErrorValues, formRequireValues } from '../common/general.enum.js';

const createTopicSchema: Schema = {
  topic: {
    exists: true,
    isString: true,
    isLength: {
      options: {
        min: formRequireValues.topicMin,
        max: formRequireValues.topicMax,
      },
      errorMessage: formErrorValues.topicError,
    },
  },
};

const updateCourseTopicsSchema: Schema = {
  topics: {
    exists: true,
    custom: {
      options: (value) =>
        Array.isArray(value) && value.every((item) => Number.isInteger(item)),
    },
  },
};

export { createTopicSchema, updateCourseTopicsSchema };
