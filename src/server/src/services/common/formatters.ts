import { Result, ValidationError } from 'express-validator';
import { ApiError, ApiSuccess, Data } from './interfaces';

export const formatError = (errorCode: number, data?: Data): ApiError => {
  return {
    errorCode: errorCode,
    data: data,
  };
};

export const formatSuccess = (data: Data): ApiSuccess => {
  return {
    errorCode: null,
    data: data,
  };
};
