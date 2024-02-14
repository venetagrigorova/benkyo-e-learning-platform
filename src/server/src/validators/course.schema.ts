import { Schema } from 'express-validator';
import moment from 'moment';

const createCourseSchema: Schema = {
  courseTitle: {
    exists: true,
    isString: true,
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: 'Title should be 3 to 100 characters',
    },
    customSanitizer: {
      options: (value) =>
        value.replace(/(\r\n|\n|\r)/gm, '').replace(/"/gm, '&quot;'),
    },
  },
  courseDescription: {
    exists: true,
    isString: true,
    isLength: {
      options: { min: 20 },
      errorMessage: 'Description should be at least 20 characters',
    },
    customSanitizer: {
      options: (value) =>
        // value.replace(/(\r\n|\n|\r)/gm, '').replace(/"/gm, '&quot;'),
        value.replace(/"/gm, '&quot;'),
    },
  },
  courseIsprivate: {
    exists: true,
    isBoolean: true,
  },
  courseDateRestriction: {
    optional: true,
    custom: {
      options: (value) => value === null || moment(value).isValid(),
    },
    customSanitizer: {
      options: (value) => {
        const time = new Date(value);
        const formatted = `${time.getFullYear()}-${
          time.getMonth() + 1
        }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
        return !value ? null : formatted;
      },
    },
  },
};

const updateCourseSchema: Schema = {
  courseTitle: {
    optional: true,
    isString: true,
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: 'Title should be 3 to 100 characters',
    },
    customSanitizer: {
      options: (value) =>
        value.replace(/(\r\n|\n|\r)/gm, '').replace(/"/gm, '&quot;'),
    },
  },
  courseDescription: {
    optional: true,
    isString: true,
    isLength: {
      options: { min: 20 },
      errorMessage: 'Title should be at least 20 characters',
    },
    customSanitizer: {
      options: (value) =>
        // value.replace(/(\r\n|\n|\r)/gm, '').replace(/"/gm, '&quot;'),
        value.replace(/"/gm, '&quot;'),
    },
  },
  courseIsprivate: {
    optional: true,
    isBoolean: true,
  },
  courseDateRestriction: {
    optional: true,
    custom: {
      options: (value) => value === null || moment(value).isValid(),
    },
    customSanitizer: {
      options: (value) => {
        const time = new Date(value);
        const formatted = `${time.getFullYear()}-${
          time.getMonth() + 1
        }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
        return !value ? null : formatted;
      },
    },
  },
  courseOwnerId: {
    optional: true,
    isInt: true,
  },
};

const enrollSchema: Schema = {
  users: {
    exists: true,
    isArray: true,
  },
};

export { createCourseSchema, updateCourseSchema, enrollSchema };
