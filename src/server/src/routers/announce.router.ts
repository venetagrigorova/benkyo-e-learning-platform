import { UserRoles } from '../common/user-roles.enum.js';
import {
  authorizeMiddleware,
  roleMiddleware,
} from './../authentication/authorizations.js';
import express from 'express';
import { checkSchema } from 'express-validator';
import { announcesController } from '../controllers/announce.controller.js';
import { createAnnouncementSchema } from '../validators/announcement.schema.js';
import { isUserPermitted } from '../authentication/is-user-permitted.js';
import idChecker from '../validators/id.checker.js';

export const announcesRouter = express.Router({ mergeParams: true });

announcesRouter.param('announcementId', idChecker);

announcesRouter
  .route('/')
  .get(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    isUserPermitted,
    announcesController.getCourseAnnouncements
  )
  .post(
    checkSchema(createAnnouncementSchema),
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER]),
    isUserPermitted,
    announcesController.createAnnouncement
  )
  .put(
    checkSchema(createAnnouncementSchema),
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER]),
    isUserPermitted,
    announcesController.updateAnnouncement
  );

announcesRouter
  .route('/:announcementId')
  .get(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    isUserPermitted,
    announcesController.getAnnouncement
  )
  .delete(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER]),
    isUserPermitted,
    announcesController.deleteAnnouncement
  );
