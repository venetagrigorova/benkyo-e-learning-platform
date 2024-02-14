import { UserInfoDBSafe } from './../interfaces/user-info.interface';
import { Request, Response } from 'express';
import { UserRoles } from '../common/user-roles.enum.js';
import { CustomRequest } from '../interfaces/request.interface.js';
import { TokenPayloadInterface } from '../interfaces/token.interface.js';
import {
  UserInfoNoRole,
  UserInfoWithRole,
} from '../interfaces/user-info.interface.js';
import { formatError } from '../services/common/formatters.js';
import { coursesServices } from '../services/course.services.js';
import { serviceErrors } from '../services/service.errors.js';
import { usersServices } from '../services/user.services.js';
import { validationResult } from '../validators/validation-result.js';

const signupUser = async (
  req: CustomRequest<UserInfoNoRole>,
  res: Response
): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }

  const newUser: UserInfoWithRole = { ...req.body, role: UserRoles.STUDENT };
  const createdUser = await usersServices.createUser(newUser);

  if (createdUser.errorCode === serviceErrors.DUPLICATE_RECORD) {
    res.status(409).json(createdUser);
    return;
  }

  if (createdUser.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).json(createdUser);
    return;
  }

  res.status(201).json(createdUser);
  return;
};

const editUser = async (
  req: CustomRequest<UserInfoDBSafe>,
  res: Response
): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }

  const editedUser = await usersServices.editUser(req.body);

  if (editedUser.errorCode === serviceErrors.VALIDATION_ERROR) {
    res.status(400).json(editedUser);
    return;
  }

  if (editedUser.errorCode === serviceErrors.DUPLICATE_RECORD) {
    res.status(409).json(editedUser);
    return;
  }

  if (editedUser.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).json(editedUser);
    return;
  }

  res.status(201).json(editedUser);
  return;
};

const getOwnCourses = async (req: Request, res: Response): Promise<void> => {
  const userIdParam = +req.params.userId;
  const user = req.user as TokenPayloadInterface;
  if (userIdParam !== user.userId) {
    res.status(401).json(formatError(serviceErrors.OPERATION_NOT_PERMITTED));
    return;
  }
  const result = await coursesServices.getOwnCourses(userIdParam);

  if (result.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).json(result);
    return;
  }

  res.status(200).json(result);
  return;
};

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await usersServices.getAllUsersInfo();

  if (users.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).json(users);
    return;
  }

  res.status(200).json(users);
  return;
};

const getUser = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.userId);
  const user = await usersServices.getUserInfo(userId);

  if (user.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).json(user);
    return;
  }

  res.status(200).json(user);
  return;
};

export const usersController = {
  signupUser,
  editUser,
  getAllUsers,
  getUser,
  getOwnCourses,
};
