import {Schema} from 'express-validator';

const createAnnouncementSchema: Schema = {
  announcementTitle: {
    exists: true,
    isString: true,
    isLength: {
      options: {min: 3, max: 50},
      errorMessage: 'Title should be 3 to 50 characters long.',
    },
  },
  announcementContent: {
    exists: true,
    isString: true,
    isLength: {
      options: {min: 3},
      errorMessage: 'Content should be at least 3 characters long.',
    },
  },
  announcementCourseId: {
    exists: true,
    isInt: true,
  },
};

export {
  createAnnouncementSchema,
};
