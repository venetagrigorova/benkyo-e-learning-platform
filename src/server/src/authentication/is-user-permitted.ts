import { NextFunction, Request, Response } from 'express';
import { UserRoles } from '../common/user-roles.enum.js';
import { PermissionsInfo } from '../interfaces/course.interface.js';
import {
  CourseOwnerInfo,
  CoursePrivacyInfo,
} from '../interfaces/database-interfaces/db-courses.interface.js';
import { TokenPayloadInterface } from '../interfaces/token.interface.js';
import { UserInfoDBSafe } from '../interfaces/user-info.interface.js';
import { formatError } from '../services/common/formatters.js';
import { coursesServices } from '../services/course.services.js';
import { serviceErrors } from '../services/service.errors.js';

const isUserPermitted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as TokenPayloadInterface;
  const courseId = +req.params.courseId;
  const courseOwner = await coursesServices.getCourseOwner(courseId);
  const userPermission = await coursesServices.getEnrollmentRecord(
    user.userId,
    courseId
  );
  const courseAudience = await coursesServices.getCourseAudience(courseId);

  if (
    userPermission.errorCode === serviceErrors.UNKNOWN_ERROR ||
    courseOwner.errorCode === serviceErrors.UNKNOWN_ERROR
  ) {
    res.status(500).send(formatError(serviceErrors.UNKNOWN_ERROR));
    return;
  }
  const isOwner =
    (courseOwner.data as CourseOwnerInfo).courseOwnerId === user.userId;
  const isAllowedUser =
    (userPermission.data as PermissionsInfo).userId === user.userId ||
    (courseAudience.data as CoursePrivacyInfo).courseIsprivate === 0;

  if (!isOwner && !isAllowedUser) {
    res.status(403).send(formatError(serviceErrors.OPERATION_NOT_PERMITTED));
    return;
  }
  next();
};

export { isUserPermitted };
