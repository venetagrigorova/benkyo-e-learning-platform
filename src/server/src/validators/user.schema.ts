import { Schema } from 'express-validator';
import { formErrorValues, formRequireValues } from '../common/general.enum.js';

const createUserSchema: Schema = {
  email: {
    exists: true,
    isEmail: true,
    errorMessage: 'incorrect email',
  },
  firstName: {
    exists: true,
    isString: true,
    isLength: {
      errorMessage: formErrorValues.firstNameError,
      options: {},
    },
  },
  lastName: {
    isString: true,
    isLength: {
      errorMessage: formErrorValues.lastNameError,
      options: {
        min: formRequireValues.nameMin,
        max: formRequireValues.nameMax,
      },
    },
  },
  birthdate: {
    optional: true,
    custom: {
      options: (value) => {
        return value === null || Number.isInteger(Date.parse(value));
      },
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
  password: {
    exists: true,
    isString: true,
    isLength: {
      errorMessage: formErrorValues.createPasswordError,
      options: {
        min: formRequireValues.passwordMin,
        max: formRequireValues.passwordax,
      },
    },
  },
};

const editUserSchema: Schema = {
  userId: {
    exists: true,
    isInt: true,
  },
  email: {
    exists: true,
    isEmail: true,
    errorMessage: 'Invalid email.',
  },
  firstName: {
    exists: true,
    isString: true,
    isLength: {
      errorMessage: formErrorValues.firstNameError,
      options: {},
    },
  },
  lastName: {
    isString: true,
    isLength: {
      errorMessage: formErrorValues.lastNameError,
      options: {
        min: formRequireValues.nameMin,
        max: formRequireValues.nameMax,
      },
    },
  },
  birthdate: {
    optional: true,
    custom: {
      options: (value) => {
        return value === null || Number.isInteger(Date.parse(value));
      },
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

const loginSchema: Schema = {
  email: {
    isEmail: true,
  },
  password: {
    isString: true,
    isLength: {
      errorMessage: formErrorValues.enterPasswordError,
      options: {
        min: formRequireValues.passwordMin,
        max: formRequireValues.passwordax,
      },
    },
  },
};

export { createUserSchema, loginSchema, editUserSchema };
