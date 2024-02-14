import express from 'express';
import { checkSchema } from 'express-validator';
import {
  authorizeMiddleware,
  roleMiddleware,
} from '../authentication/authorizations.js';
import { isUserPermitted } from '../authentication/is-user-permitted.js';
import { UserRoles } from '../common/user-roles.enum.js';
import { courseController } from '../controllers/course.controller.js';
import { topicController } from '../controllers/topic.controller.js';
import {
  createCourseSchema,
  enrollSchema,
  updateCourseSchema,
} from '../validators/course.schema.js';
import idChecker from '../validators/id.checker.js';
import { updateCourseTopicsSchema } from '../validators/topic.schema.js';
import { announcesRouter } from './announce.router.js';
import { sectionsRouter } from './section.router.js';

export const coursesRouter = express.Router();

coursesRouter.param('courseId', idChecker);

coursesRouter
  .route('/')
  .get(courseController.getAllCourses)
  .post(
    checkSchema(createCourseSchema),
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER]),
    courseController.createCourse
  );

coursesRouter
  .route('/:courseId')
  .get(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    isUserPermitted,
    courseController.getCourse
  )
  .put(
    checkSchema(updateCourseSchema),
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER]),
    isUserPermitted,
    courseController.updateCourse
  )
  .delete(
    roleMiddleware([UserRoles.TEACHER]),
    isUserPermitted,
    courseController.deleteCourse
  );

coursesRouter
  .route('/:courseId/permissions')
  .get(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    isUserPermitted,
    courseController.getEnrolledStudents
  )
  .post(
    checkSchema(enrollSchema),
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER]),
    isUserPermitted,
    courseController.enrollStudents
  )
  .delete(
    checkSchema(enrollSchema),
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER]),
    isUserPermitted,
    courseController.unenrollStudents
  );

coursesRouter
  .route('/:courseId/selfenroll')
  .post(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    courseController.selfEnroll
  )
  .delete(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    courseController.selfUnenroll
  );

coursesRouter
  .route('/:courseId/progress')
  .get(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    isUserPermitted,
    courseController.getCourseProgress
  );

coursesRouter
  .route('/:courseId/topics')
  .put(
    checkSchema(updateCourseTopicsSchema),
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER]),
    isUserPermitted,
    topicController.updateCourseTopics
  );

coursesRouter.use('/:courseId/sections/', sectionsRouter);
coursesRouter.use('/:courseId/announcements', announcesRouter);
