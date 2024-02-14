import './config.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import jwtStrategy from './authentication/strategy.js';
import { authorizeMiddleware } from './authentication/authorizations.js';
import { authRouter } from './routers/auth.router.js';
import { userRouter } from './routers/user.router.js';
import { coursesRouter } from './routers/course.router.js';
import { topicRouter } from './routers/topic.router.js';

export const app = express();
const PORT = process.env.EXPRESS_PORT;

passport.use(jwtStrategy);

app.use(express.json(), cors(), helmet(), morgan('dev'), passport.initialize());

app.use('/auth', authRouter);
app.use(
  '/users',
  (req, res, next) => authorizeMiddleware(req, res, next),
  userRouter
);
app.use(
  '/courses',
  (req, res, next) => authorizeMiddleware(req, res, next),
  coursesRouter
);
app.use(
  '/topics',
  (req, res, next) => authorizeMiddleware(req, res, next),
  topicRouter
);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
