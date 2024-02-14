import { lessonsRouter } from './lesson.router.js';
import express from 'express';
import { checkSchema } from 'express-validator';
import {
  authorizeMiddleware,
  roleMiddleware,
} from '../authentication/authorizations.js';
import { UserRoles } from '../common/user-roles.enum.js';
import { sectionController } from '../controllers/section.controller.js';
import {
  createSectionSchema,
  updateSectionSchema,
} from '../validators/section.schema.js';
import { isUserPermitted } from '../authentication/is-user-permitted.js';
import idChecker from '../validators/id.checker.js';

export const sectionsRouter = express.Router({ mergeParams: true });

sectionsRouter.param('sectionId', idChecker);

sectionsRouter
  .route('/')
  .get(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    isUserPermitted,
    sectionController.getSections
  )
  .post(
    checkSchema(createSectionSchema),
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER]),
    isUserPermitted,
    sectionController.createSection
  );

sectionsRouter
  .route('/:sectionId')
  .get(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    isUserPermitted,
    sectionController.getSection
  )
  .put(
    checkSchema(updateSectionSchema),
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER]),
    isUserPermitted,
    sectionController.updateSection
  )
  .delete(
    roleMiddleware([UserRoles.TEACHER]),
    isUserPermitted,
    sectionController.deleteSection
  );

sectionsRouter.use('/:sectionId/lessons', lessonsRouter);
