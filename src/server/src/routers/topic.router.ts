import express from 'express';
import { checkSchema } from 'express-validator';
import {
  authorizeMiddleware,
  roleMiddleware,
} from '../authentication/authorizations.js';
import { UserRoles } from '../common/user-roles.enum.js';
import { topicController } from '../controllers/topic.controller.js';
import { createTopicSchema } from '../validators/topic.schema.js';

export const topicRouter = express.Router();

topicRouter.route('/popular').get(topicController.getMostPopularTopics);

topicRouter
  .route('/')
  .get(topicController.getTopics)
  .post(
    checkSchema(createTopicSchema),
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER])
  );
