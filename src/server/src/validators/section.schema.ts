import { Schema } from 'express-validator';
import moment from 'moment';

const createSectionSchema: Schema = {
  sectionTitle: {
    exists: true,
    isString: true,
    isLength: {
      options: { min: 3 },
      errorMessage: 'Title should be 3 to 100 characters',
    },
    customSanitizer: {
      options: (value) =>
        value.replace(/(\r\n|\n|\r)/gm, '').replace(/"/gm, '&quot;'),
    },
  },
  sectionDescription: {
    exists: true,
    isString: true,
    isLength: {
      options: { min: 20 },
      errorMessage: 'Title should be at least 20 characters',
    },
    customSanitizer: {
      options: (value) =>
        value.replace(/(\r\n|\n|\r)/gm, '').replace(/"/gm, '&quot;'),
    },
  },
  sectionOrder: {
    exists: true,
    isInt: true,
  },
  sectionDateRestriction: {
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

const updateSectionSchema: Schema = {
  sectionTitle: {
    optional: true,
    isString: true,
    isLength: {
      options: { min: 3 },
      errorMessage: 'Title should be 3 to 100 characters',
    },
    customSanitizer: {
      options: (value) =>
        value.replace(/(\r\n|\n|\r)/gm, '').replace(/"/gm, '&quot;'),
    },
  },
  sectionDescription: {
    optional: true,
    isString: true,
    isLength: {
      options: { min: 20 },
      errorMessage: 'Title should be at least 20 characters',
    },
    customSanitizer: {
      options: (value) =>
        value.replace(/(\r\n|\n|\r)/gm, '').replace(/"/gm, '&quot;'),
    },
  },
  sectionIsprivate: {
    optional: true,
    isInt: true,
  },
  sectionOrder: {
    optional: true,
    isInt: true,
  },
  sectionDateRestriction: {
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

export { createSectionSchema, updateSectionSchema };
