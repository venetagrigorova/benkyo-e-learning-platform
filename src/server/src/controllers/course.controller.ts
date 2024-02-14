import { Request, Response } from 'express';
import { UserRoles } from '../common/user-roles.enum.js';
import {
  NewCourseData,
  UpdateCourseData,
} from '../interfaces/course.interface.js';
import { CustomRequest } from '../interfaces/request.interface.js';
import { TokenPayloadInterface } from '../interfaces/token.interface.js';
import { coursesServices } from '../services/course.services.js';
import { serviceErrors } from '../services/service.errors.js';
import { validationResult } from '../validators/validation-result.js';

const getCourse = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as TokenPayloadInterface;
  const userId = +user.userId;
  const course = await coursesServices.getCourseById(
    +req.params.courseId,
    userId
  );

  if (course.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(course);
    return;
  }

  res.status(200).send(course);
};

const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }
  const user = req.user as TokenPayloadInterface;

  // const courses =
  //   user.role === UserRoles.TEACHER
  //     ? await coursesServices.getAllCourses()
  //     : user.role === UserRoles.STUDENT
  //     ? await coursesServices.getCoursesRegisteredUser(user.userId)
  //     : await coursesServices.getPublicCourses();

  const courses =
    user.role === UserRoles.ANON
      ? await coursesServices.getPublicCourses()
      : await coursesServices.getCoursesRegisteredUser(user.userId);

  if (courses.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(courses);
    return;
  }

  res.status(200).send(courses);
};

const createCourse = async (
  req: CustomRequest<NewCourseData>,
  res: Response
): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }

  const user = req.user as TokenPayloadInterface;
  const newCourseData = { ...req.body, courseOwnerId: user.userId };

  const createdCourse = await coursesServices.createCourse(newCourseData);

  if (createdCourse.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(createdCourse);
    return;
  }

  res.status(200).send(createdCourse);
  return;
};

const updateCourse = async (
  req: CustomRequest<UpdateCourseData>,
  res: Response
): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }
  const user = req.user as TokenPayloadInterface;
  const updatedCourse = await coursesServices.updateCourse({
    ...req.body,
    courseId: +req.params.courseId,
    courseOwnerId: user.userId,
  });

  if (updatedCourse.errorCode === serviceErrors.OPERATION_NOT_PERMITTED) {
    res.status(401).send(updatedCourse);
    return;
  }

  if (updatedCourse.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(updatedCourse);
    return;
  }

  if (updatedCourse.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(updatedCourse);
    return;
  }

  res.status(201).send(updatedCourse);
  return;
};

const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as TokenPayloadInterface;
  const result = await coursesServices.deleteCourse({
    courseOwnerId: user.userId,
    courseId: +req.params.courseId,
  });

  if (result.errorCode === serviceErrors.OPERATION_NOT_PERMITTED) {
    res.status(401).send(result);
    return;
  }

  if (result.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(result);
    return;
  }

  if (result.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(result);
    return;
  }

  res.status(200).send(result);
  return;
};

const getCourseProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  let userId;
  if (Object.keys(req.body).length !== 0) {
    userId = req.body.userId;
  } else {
    const user = req.user as TokenPayloadInterface;
    userId = user.userId;
  }
  const courseId = +req.params.courseId;
  const course = await coursesServices.getCourseProgress(userId, courseId);

  if (course.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(course);
    return;
  }

  res.status(200).send(course);
};

const enrollStudents = async (req: Request, res: Response): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }

  const courseId = Number(req.params.courseId);
  const enrollRecord = await coursesServices.enrollStudents(
    req.body.users,
    courseId
  );

  if (enrollRecord.errorCode === serviceErrors.DUPLICATE_RECORD) {
    res.status(409).json(enrollRecord);
    return;
  }

  res.status(201).json(enrollRecord);
  return;
};

const unenrollStudents = async (req: Request, res: Response): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }

  const courseId = Number(req.params.courseId);
  const enrollRecord = await coursesServices.unenrollStudents(
    req.body.users,
    courseId
  );

  if (enrollRecord.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(401).json(enrollRecord);
    return;
  }

  res.status(200).json(enrollRecord);
  return;
};

const selfEnroll = async (req: Request, res: Response): Promise<void> => {
  const courseId = +req.params.courseId;
  const user = req.user as TokenPayloadInterface;
  const userId = user.userId;

  const result = await coursesServices.selfEnroll(userId, courseId, user.role);

  if (result.errorCode === serviceErrors.OPERATION_NOT_PERMITTED) {
    res.status(403).send(result);
    return;
  }

  if (result.errorCode === serviceErrors.DUPLICATE_RECORD) {
    res.status(409).send(result);
    return;
  }

  if (result.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(result);
    return;
  }

  res.status(201).send(result);
};

const selfUnenroll = async (req: Request, res: Response) => {
  const courseId = +req.params.courseId;
  const user = req.user as TokenPayloadInterface;
  const userId = user.userId;
  const result = await coursesServices.selfUnenroll(
    userId,
    courseId,
    user.role
  );

  if (result.errorCode === serviceErrors.OPERATION_NOT_PERMITTED) {
    res.status(403).send(result);
    return;
  }

  if (result.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).send(result);
    return;
  }

  if (result.errorCode === serviceErrors.UNKNOWN_ERROR) {
    res.status(500).send(result);
    return;
  }

  res.status(200).send(result);
};

const getEnrolledStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const courseId = Number(req.params.courseId);
  const students = await coursesServices.getEnrolledStudents(courseId);

  if (students.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).json(students);
    return;
  }

  res.status(200).json(students);
  return;
};

const getUnenrolledStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const courseId = Number(req.params.courseId);
  const students = await coursesServices.getUnenrolledStudents(courseId);

  if (students.errorCode === serviceErrors.RECORD_NOT_FOUND) {
    res.status(404).json(students);
    return;
  }

  res.status(200).json(students);
  return;
};

export const courseController = {
  getCourse,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseProgress,
  enrollStudents,
  unenrollStudents,
  selfEnroll,
  selfUnenroll,
  getEnrolledStudents,
  getUnenrolledStudents,
};
