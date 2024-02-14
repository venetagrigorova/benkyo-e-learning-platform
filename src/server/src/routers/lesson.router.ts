import { userRouter } from './user.router.js';
import express from 'express';
import { checkSchema } from 'express-validator';
import {
  authorizeMiddleware,
  roleMiddleware,
} from '../authentication/authorizations.js';
import { UserRoles } from '../common/user-roles.enum.js';
import { lessonsController } from '../controllers/lessons.controller.js';
import {
  createLessonSchema,
  updateLessonSchema,
} from '../validators/lesson.schema.js';
import { isUserPermitted } from '../authentication/is-user-permitted.js';
import idChecker from '../validators/id.checker.js';

export const lessonsRouter = express.Router({ mergeParams: true });

lessonsRouter.param('lessonId', idChecker);

lessonsRouter
  .route('/')
  .get(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    isUserPermitted,
    lessonsController.getLessons
  )
  .post(
    checkSchema(createLessonSchema),
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER]),
    isUserPermitted,
    lessonsController.createLesson
  );

lessonsRouter
  .route('/:lessonId')
  .get(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    isUserPermitted,
    lessonsController.getLesson
  )
  .put(
    checkSchema(updateLessonSchema),
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER]),
    isUserPermitted,
    lessonsController.updateLesson
  )
  .delete(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER]),
    isUserPermitted,
    lessonsController.deleteLesson
  );

lessonsRouter
  .route('/:lessonId/complete')
  .post(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    isUserPermitted,
    lessonsController.addLessonStats
  );

lessonsRouter
  .route('/:lessonId/incomplete')
  .delete(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    isUserPermitted,
    lessonsController.deleteLessonStats
  );
