import { authorizeMiddleware } from './../authentication/authorizations.js';
import express from 'express';
import { checkSchema } from 'express-validator';
import { roleMiddleware } from '../authentication/authorizations.js';
import { UserRoles } from '../common/user-roles.enum.js';
import { usersController } from '../controllers/user.controller.js';
import { createUserSchema, editUserSchema } from '../validators/user.schema.js';
import idChecker from '../validators/id.checker.js';

export const userRouter = express.Router();

userRouter.param('userId', idChecker);

userRouter
  .route('/')
  .post(checkSchema(createUserSchema), usersController.signupUser)
  .get(
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    usersController.getAllUsers
  );

userRouter
  .route('/:userId')
  .post(checkSchema(createUserSchema), usersController.signupUser)
  .get(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    usersController.getUser
  )
  .put(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT]),
    checkSchema(editUserSchema),
    usersController.editUser
  );

userRouter
  .route('/:userId/courses')
  .get(
    authorizeMiddleware,
    roleMiddleware([UserRoles.TEACHER]),
    usersController.getOwnCourses
  );

// userRouter
//   .route('/enrollment/:course_id/:user_id')
//   .get(
//     roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.ANON]),
//     usersController.isStudentEnrolled
//   )
//   .post(
//     roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.ANON]),
//     usersController.enrollStudent
//   )
//   .delete(
//     roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.ANON]),
//     usersController.unenrollStudent
//   );

// userRouter
//   .route('/enrolled/:course_id')
//   .get(
//     roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.ANON]),
//     usersController.getEnrolledStudents
//   );

// userRouter
//   .route('/unenrolled/:course_id')
//   .get(
//     roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.ANON]),
//     usersController.getUnenrolledStudents
//   );

// userRouter
//   .route('/students/:user_id')
//   .get(
//     roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.ANON]),
//     usersController.getStudent
//   );

// userRouter
//   .route('/students')
//   .get(
//     roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.ANON]),
//     usersController.getAllStudents
//   );

// userRouter
//   .route('/teachers/:user_id')
//   .get(
//     roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.ANON]),
//     usersController.getTeacher
//   );

// userRouter
//   .route('/teachers')
//   .get(
//     roleMiddleware([UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.ANON]),
//     usersController.getAllTeachers
//   );
