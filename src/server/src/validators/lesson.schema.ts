import { allowediFrameAttributes } from './../common/allowedHTMLAttributes.js';
import { Schema } from 'express-validator';
import sanitizeHtml from 'sanitize-html';
import moment from 'moment';

const createLessonSchema: Schema = {
  lessonTitle: {
    exists: true,
    isString: true,
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage: 'Title should be 3 to 50 characters long.',
    },
    customSanitizer: {
      options: (value) =>
        value && value.replace(/(\r\n|\n|\r)/gm, '').replace(/"/gm, '&quot;'),
      // value && value.replace(/"/gm, '&quot;'),
    },
  },
  lessonDescription: {
    exists: true,
    isString: true,
    isLength: {
      options: { min: 3 },
      errorMessage: 'Description should be at least 3 characters long.',
    },
    customSanitizer: {
      options: (value) =>
        value && value.replace(/(\r\n|\n|\r)/gm, '').replace(/"/gm, '&quot;'),
      // value && value.replace(/"/gm, '&quot;'),
    },
  },
  lessonOrder: {
    exists: true,
    isInt: true,
    errorMessage: 'Missing lesson order.',
  },
  lessonDate: {
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
  lessonContent: {
    exists: true,
    isObject: true,
    custom: {
      options: (value) => {
        if (value) {
          if (!value.hasOwnProperty('body')) {
            throw new Error('Body field is missing.');
          }
          if (typeof value.body !== 'string') {
            throw new Error('Body should be a string.');
          }
          if (!value.hasOwnProperty('iframes')) {
            throw new Error('iFrames field is missing.');
          }
          if (!Array.isArray(value.iframes)) {
            throw new Error('iFrames should be an array.');
          }
          if (
            value.iframes.length &&
            value.iframes.some((iframe: any) => typeof iframe !== 'string')
          ) {
            throw new Error('iFrames should be an array of strings.');
          }
          return true;
        }
      },
    },
    customSanitizer: {
      options: (value, { req, location, path }) => {
        if (value) {
          let sanitizedBody;
          let sanitizediFrames;

          if (value.body && Array.isArray(value.iframes) && location && path) {
            sanitizedBody = sanitizeHtml(value.body, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
              allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: [ 'src', 'alt' ],
              },
            });
            sanitizediFrames = value.iframes.map((iframe: string) => {
              const cleaned = sanitizeHtml(iframe, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                  'iframe',
                ]),
                allowedAttributes: {
                  ...sanitizeHtml.defaults.allowedAttributes,
                  iframe: allowediFrameAttributes,
                },
              });
              return cleaned;
            });
          } else {
            sanitizedBody = '';
            sanitizediFrames = '';
          }
          const sanitizedHTML = {
            body: sanitizedBody,
            iframes: sanitizediFrames,
          };
          return sanitizedHTML;
        }
      },
    },
  },
};

const updateLessonSchema: Schema = {
  lessonTitle: {
    optional: true,
    isString: true,
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage: 'Title should be 3 to 50 characters long.',
    },
    customSanitizer: {
      options: (value) =>
        value && value.replace(/(\r\n|\n|\r)/gm, '').replace(/"/gm, '&quot;'),
      // value && value.replace(/"/gm, '&quot;'),
    },
  },
  lessonDescription: {
    optional: true,
    isString: true,
    isLength: {
      options: { min: 3 },
      errorMessage: 'Description should be at least 3 characters long.',
    },
    customSanitizer: {
      options: (value) =>
        value && value.replace(/(\r\n|\n|\r)/gm, '').replace(/"/gm, '&quot;'),
      // value && value.replace(/"/gm, '&quot;'),
    },
  },
  lessonOrder: {
    optional: true,
    isInt: true,
  },
  lessonDate: {
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
  lessonContent: {
    optional: true,
    isObject: true,
    custom: {
      options: (value) => {
        if (value) {
          if (!value.hasOwnProperty('body')) {
            throw new Error('Body field is missing.');
          }
          if (typeof value.body !== 'string') {
            throw new Error('Body should be a string.');
          }
          if (!value.hasOwnProperty('iframes')) {
            throw new Error('iFrames field is missing.');
          }
          if (!Array.isArray(value.iframes)) {
            throw new Error('iFrames should be an array.');
          }
          if (
            value.iframes.length &&
            value.iframes.some((iframe: any) => typeof iframe !== 'string')
          ) {
            throw new Error('iFrames should be an array of strings.');
          }
          return true;
        }
      },
    },
    customSanitizer: {
      options: (value, { req, location, path }) => {
        if (value) {
          let sanitizedBody;
          let sanitizediFrames;

          if (value.body && Array.isArray(value.iframes) && location && path) {
            sanitizedBody = sanitizeHtml(value.body, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
              allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: [ 'src', 'alt' ],
              },
            });
            sanitizediFrames = value.iframes.map((iframe: string) => {
              const cleaned = sanitizeHtml(iframe, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                  'iframe',
                ]),
                allowedAttributes: {
                  ...sanitizeHtml.defaults.allowedAttributes,
                  iframe: allowediFrameAttributes,
                },
              });
              return cleaned;
            });
          } else {
            sanitizedBody = '';
            sanitizediFrames = '';
          }
          const sanitizedHTML = {
            body: sanitizedBody,
            iframes: sanitizediFrames,
          };
          return sanitizedHTML;
        }
      },
    },
  },
};

export { createLessonSchema, updateLessonSchema };
