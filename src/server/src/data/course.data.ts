import { UserInfoDBSafeRAW } from './../interfaces/database-interfaces/db-users.interface';
import { UserInfoDBSafe } from './../interfaces/user-info.interface';
import {
  CourseInfo,
  CourseInfoSections,
  CourseStats,
  NewCourseData,
  NewCourseDataWithID,
  PermissionsInfo,
  UpdateCourseData,
} from '../interfaces/course.interface.js';
import {
  CourseInfoDB,
  CourseInfoDBPermission,
  CourseInfoDBSections,
  CourseOwnerInfo,
  CourseOwnerInfoDB,
  CoursePrivacyInfo,
  CoursePrivacyInfoDB,
  CourseProgressDB,
  CourseSectionDBPermission,
  DeleteCourseInfo,
} from '../interfaces/database-interfaces/db-courses.interface.js';
import { InsertionReturn } from '../interfaces/database-interfaces/returns.interface.js';
import {
  courseDataPermissionPreparator,
  courseDataPreparator,
  courseSectionPermissionPreparator,
  courseSectionsPreparator,
} from './common/course.methods.js';
import { convertUTCtoSQL } from '../common/dateUTCtoSQL.js';
import pool from './pool.js';
import { serviceErrors } from '../services/service.errors.js';

const getCourseById = async (
  courseId: number,
  userId?: number
): Promise<CourseInfoSections | undefined> => {
  try {
    const sql = `
    SELECT 
      c.course_id,
      c.course_title,
      c.course_description,
      tc.course_topics,
      c.course_isprivate,
      c.course_upload_date,
      s.course_sections_info,
      c.course_date_restriction,
      c.course_last_update,
      c.course_owner_id,
      u.first_name as course_owner_first_name,
      u.last_name as course_owner_last_name
      ${userId ? `, COALESCE(perm.course_id, 0) as is_enrolled` : ''}
    FROM courses c
    LEFT JOIN (
      SELECT course_id,     CONCAT('[', group_CONCAT(
        CONCAT('{"topicId":', t.topic_id, 
            ', "topicName":"', t.topic_name,
            '"}')), ']') as course_topics
      FROM topics_courses tc
      JOIN topics t
        ON tc.topic_id = t.topic_id
      WHERE tc.course_id = ?) tc
      ON tc.course_id = c.course_id
    LEFT JOIN (
      SELECT
        c.course_id as course_id,
        CONCAT('[', group_CONCAT(
        CONCAT('{"sectionId":', s.section_id, 
            ', "sectionTitle":"', s.section_title, 
            '", "sectionDescription":"', s.section_description, 
            '", "sectionUploadDate":"', s.section_upload_date, 
            '", "sectionDateRestriction":"', COALESCE(s.section_date_restriction, ''), 
            '", "sectionOrder":"', s.section_order, 
            '"}') ORDER BY s.section_order, s.section_upload_date DESC)
            , ']') as course_sections_info
      FROM courses c
      LEFT JOIN sections s
        ON c.course_id = s.section_course_id
      WHERE c.course_id = ? AND s.section_isdeleted = 0) s
      ON s.course_id = c.course_id
    LEFT JOIN users u
      ON u.user_id = c.course_owner_id
    ${
      userId
        ? `LEFT JOIN (
      SELECT * FROM course_allowed_users
      WHERE user_id = ? AND course_id = ?
      ) as perm
		  ON perm.course_id = c.course_id`
        : ''
    }
    WHERE c.course_id = ? AND c.course_isdeleted = 0
    GROUP BY c.course_id`;

    const result = (await pool.query(
      sql,
      userId
        ? [courseId, courseId, userId, courseId, courseId]
        : [courseId, courseId, courseId]
    )) as CourseSectionDBPermission[];
    if (!result[0]) {
      return;
    }
    const preparedData = courseSectionPermissionPreparator(result[0]);

    return preparedData;
  } catch (err) {
    return err;
  }
};

// const getAllCourses = async (): Promise<CourseInfo[] | undefined> => {
//   try {
//     const sql = `
//     SELECT
//     c.course_id,
//     c.course_title,
//     c.course_description,
//     tc.course_topics,
//     c.course_isprivate,
//     c.course_upload_date,
//     s.course_sections_info,
//     c.course_date_restriction,
//     c.course_last_update,
//     c.course_owner_id,
//     u.first_name as course_owner_first_name,
//     u.last_name as course_owner_last_name
//   FROM courses c
//   LEFT JOIN (
//     SELECT course_id,     CONCAT('[', group_CONCAT(
//       CONCAT('{"topicId":', t.topic_id,
//           ', "topicName":"', t.topic_name,
//           '"}')), ']') as course_topics
//     FROM topics_courses tc
//     JOIN topics t
//       ON tc.topic_id = t.topic_id
//     GROUP BY course_id
//       ) tc
//     ON tc.course_id = c.course_id
//   LEFT JOIN (
//     SELECT
//       c.course_id as course_id,
//       CONCAT('[', group_CONCAT(
//       CONCAT('{"sectionId":', s.section_id,
//           ', "sectionTitle":"', s.section_title,
//           '", "sectionDescription":"', s.section_description,
//           '", "sectionUploadDate":"', s.section_upload_date,
//           '", "sectionDateRestriction":"', COALESCE(s.section_date_restriction, ''),
//           '", "sectionOrder":"', s.section_order,
//           '"}') ORDER BY s.section_order, s.section_upload_date DESC)
//           , ']') as course_sections_info
//     FROM courses c
//     LEFT JOIN sections s
//       ON c.course_id = s.section_course_id
//     WHERE s.section_isdeleted = 0
//     GROUP BY c.course_id) s
//     ON s.course_id = c.course_id
//   LEFT JOIN users u
//     ON u.user_id = c.course_owner_id
//   WHERE c.course_isdeleted = 0
//   GROUP BY c.course_id;
//     `;

//     const result = (await pool.query(sql)) as CourseInfoDBSections[];

//     if (!result[0]) {
//       return;
//     }
//     const preparedData = result.map((item) => courseSectionsPreparator(item));

//     return preparedData;
//   } catch (err) {
//     return err;
//   }
// };

const getOwnCourses = async (
  userId: number
): Promise<CourseInfo[] | undefined> => {
  try {
    const sql = `
    SELECT 
    c.course_id,
    c.course_title,
    c.course_description,
    tc.course_topics,
    c.course_isprivate,
    c.course_upload_date,
    s.course_sections_info,
    c.course_date_restriction,
    c.course_last_update,
    c.course_owner_id,
    u.first_name as course_owner_first_name,
    u.last_name as course_owner_last_name  
  FROM courses c
  LEFT JOIN (
    SELECT course_id,     CONCAT('[', group_CONCAT(
      CONCAT('{"topicId":', t.topic_id, 
          ', "topicName":"', t.topic_name,
          '"}')), ']') as course_topics
    FROM topics_courses tc
    JOIN topics t
      ON tc.topic_id = t.topic_id
    GROUP BY course_id
      ) tc
    ON tc.course_id = c.course_id
  LEFT JOIN (
    SELECT
      c.course_id as course_id,
      CONCAT('[', group_CONCAT(
      CONCAT('{"sectionId":', s.section_id, 
          ', "sectionTitle":"', s.section_title, 
          '", "sectionDescription":"', s.section_description, 
          '", "sectionUploadDate":"', s.section_upload_date, 
          '", "sectionDateRestriction":"', COALESCE(s.section_date_restriction, ''), 
          '", "sectionOrder":"', s.section_order, 
          '"}') ORDER BY s.section_order, s.section_upload_date DESC)
          , ']') as course_sections_info
    FROM courses c
    LEFT JOIN sections s
      ON c.course_id = s.section_course_id
    WHERE s.section_isdeleted = 0
    GROUP BY c.course_id) s
    ON s.course_id = c.course_id
  LEFT JOIN users u
    ON u.user_id = c.course_owner_id
  WHERE c.course_isdeleted = 0 AND c.course_owner_id = ?
  GROUP BY c.course_id;`;

    const result = (await pool.query(sql, [userId])) as CourseInfoDBSections[];

    if (!result[0]) {
      return;
    }
    const preparedData = result.map((item) => courseSectionsPreparator(item));

    return preparedData;
  } catch (err) {
    return err;
  }
};

const getCourseOwnerId = async (
  courseId: number
): Promise<CourseOwnerInfo | null> => {
  try {
    const sql = `
    SELECT course_id, course_owner_id
    FROM courses
    WHERE course_id = ? AND course_isdeleted = 0;
    `;

    const result = (await pool.query(sql, [courseId])) as CourseOwnerInfoDB[];

    if (result[0]) {
      return {
        courseId: result[0].course_id,
        courseOwnerId: result[0].course_owner_id,
      };
    } else {
      return null;
    }
  } catch (err) {
    return err;
  }
};

const getCourseAudience = async (
  courseId: number
): Promise<CoursePrivacyInfo | null> => {
  try {
    const sql = `
    SELECT course_id, course_isprivate
    FROM courses
    WHERE course_id = ? AND course_isdeleted = 0;`;

    const result = (await pool.query(sql, [courseId])) as CoursePrivacyInfoDB[];

    if (result[0]) {
      return {
        courseId: result[0].course_id,
        courseIsprivate: result[0].course_isprivate,
      };
    } else {
      return null;
    }
  } catch (err) {
    return err;
  }
};

const getPublicCourses = async (): Promise<CourseInfo[]> => {
  try {
    const sql = `
    SELECT * FROM (
      SELECT c.course_id,
        c.course_title,
        c.course_description,
        c.course_isprivate,
        c.course_upload_date,
        c.course_date_restriction,
        c.course_owner_id,
        u.first_name,
        u.last_name,
        tc.course_topics
      FROM courses c
      LEFT JOIN (
        SELECT 
          course_id,
          CONCAT('[', group_CONCAT(
          CONCAT('{"topicId":', t.topic_id, 
              ', "topicName":"', t.topic_name,
              '"}')), ']')
          as course_topics,
          topic_name
        FROM topics_courses tc
        LEFT JOIN topics t
          ON tc.topic_id = t.topic_id
        GROUP BY tc.course_id) tc
        ON tc.course_id = c.course_id
      LEFT JOIN users u
        ON c.course_owner_id = u.user_id
      WHERE c.course_isdeleted = 0 AND c.course_isprivate = 0
      GROUP BY c.course_id
      ORDER BY c.course_upload_date DESC
    ) r
      ORDER BY r.course_upload_date DESC;
      `;

    const result = (await pool.query(sql)) as CourseInfoDB[];

    if (!result[0]) {
      throw new Error();
    }

    return result.map(courseDataPreparator);
  } catch (err) {
    return err;
  }
};

const getCoursesRegisteredUser = async (
  userId: number
): Promise<CourseInfo[]> => {
  try {
    const sql = `
    SELECT r.*, COALESCE(ca.is_enrolled, 0) as is_enrolled  FROM (
      SELECT c.course_id,
        c.course_title,
        c.course_description,
        c.course_isprivate,
        c.course_upload_date,
        c.course_date_restriction,
        c.course_owner_id,
        u.first_name as course_owner_first_name,
        u.last_name as course_owner_last_name,
        tc.course_topics
      FROM courses c
      LEFT JOIN (
        SELECT 
          course_id,
          CONCAT('[', group_CONCAT(
          CONCAT('{"topicId":', t.topic_id, 
              ', "topicName":"', t.topic_name,
              '"}')), ']')
          as course_topics,
          topic_name
        FROM topics_courses tc
        LEFT JOIN topics t
          ON tc.topic_id = t.topic_id
        GROUP BY tc.course_id) tc
        ON tc.course_id = c.course_id
      LEFT JOIN users u
        ON c.course_owner_id = u.user_id
      WHERE c.course_isdeleted = 0
      GROUP BY c.course_id
      ORDER BY c.course_upload_date DESC
    ) r
    LEFT JOIN (
      SELECT *, true as is_enrolled FROM course_allowed_users
      WHERE user_id = ?
      ) ca
      ON r.course_id = ca.course_id
    WHERE r.course_isprivate = 1 AND ca.is_enrolled = 1 OR r.course_isprivate = 0
    ORDER BY r.course_upload_date DESC
      `;

    const result = (await pool.query(sql, [
      userId,
    ])) as CourseInfoDBPermission[];
    if (!result[0]) {
      throw new Error();
    }

    return result.map(courseDataPermissionPreparator);
  } catch (err) {
    return err;
  }
};

const createCourse = async (
  newCourseData: NewCourseData
): Promise<NewCourseDataWithID> => {
  try {
    const sql = `
    INSERT INTO courses (
      course_title,
      course_description,
      course_isprivate,
      course_owner_id${
        newCourseData.courseDateRestriction ? ', course_date_restriction' : ''
      })
    VALUES (
      ?, ?, ?, ?${newCourseData.courseDateRestriction ? ', ?' : ''});
    `;

    const result = (await pool.query(sql, [
      newCourseData.courseTitle,
      newCourseData.courseDescription,
      Number(newCourseData.courseIsprivate),
      newCourseData.courseOwnerId,
      newCourseData.courseDateRestriction,
    ])) as InsertionReturn;

    return {
      ...newCourseData,
      courseId: +result.insertId,
    };
  } catch (err) {
    return err;
  }
};

const updateCourse = async (
  updateCourseData: UpdateCourseData
): Promise<number | UpdateCourseData> => {
  try {
    const placeholders = [] as (string | number)[];
    const sqlSet = [] as string[];

    Object.keys(updateCourseData).forEach((key) => {
      switch (key) {
        case 'courseTitle':
          placeholders.push(updateCourseData.courseTitle as string);
          sqlSet.push(`course_title = ?`);
          break;
        case 'courseDescription':
          placeholders.push(updateCourseData.courseDescription as string);
          sqlSet.push(`course_description = ?`);
          break;
        case 'courseIsprivate':
          placeholders.push(Number(updateCourseData.courseIsprivate) as number);
          sqlSet.push(`course_isprivate = ?`);
          break;
        case 'courseDateRestriction':
          placeholders.push(
            convertUTCtoSQL(updateCourseData.courseDateRestriction as string)
          );
          sqlSet.push(`course_date_restriction = ?`);
          break;
        case 'courseOwnerId':
          placeholders.push(updateCourseData.courseOwnerId as number);
          sqlSet.push(`course_owner_id = ?`);
          break;
      }
    });

    if (!sqlSet[0]) {
      return serviceErrors.NO_MODIFICATION;
    }

    const sql = `
    UPDATE courses
    SET
      course_last_update = CURRENT_TIMESTAMP(),
      ${sqlSet.join(', ')}
    WHERE course_id = ? AND course_isdeleted = 0;
    `;

    const result = await pool.query(sql, [
      ...placeholders,
      updateCourseData.courseId,
    ]);

    if (result.affectedRows) {
      return updateCourseData;
    }

    throw new Error('no modifications');
  } catch (err) {
    return err;
  }
};

const deleteCourse = async (
  deleteInfo: DeleteCourseInfo
): Promise<InsertionReturn> => {
  try {
    const sql = `
    UPDATE courses
    SET course_isdeleted = 1
    WHERE course_id = ?;
    `;

    const result = await pool.query(sql, [deleteInfo.courseId]);

    return result;
  } catch (err) {
    return err;
  }
};

const getCourseProgress = async (
  userId: number,
  courseId: number
): Promise<CourseStats | null> => {
  try {
    const sql = `
    SELECT 
      lesson_stats.user_id,
      lesson_stats.course_id,
      COUNT(lesson_stats.course_id) AS complete_lessons, 
      CONCAT('[', GROUP_CONCAT(lesson_stats.lesson_id SEPARATOR ','), ']') as complete_lesson_ids
    FROM (
    SELECT 
      lesson_stats.user_id,
      lesson_stats.lesson_id,
      lessons.lesson_section_id,
      sections.section_id,
      courses.course_id
      FROM lesson_stats
      LEFT JOIN lessons
      ON lesson_stats.lesson_id = lessons.lesson_id
      LEFT JOIN sections
      ON sections.section_id = lessons.lesson_section_id
      LEFT JOIN courses
      ON courses.course_id = sections.section_course_id
      WHERE lessons.lesson_isdeleted = 0
      AND courses.course_id = ?
      AND lesson_stats.user_id = ?) lesson_stats;
    `;

    const result = (await pool.query(sql, [
      courseId,
      userId,
    ])) as CourseProgressDB[];

    if (result[0].user_id) {
      return {
        userId: result[0].user_id,
        courseId: result[0].course_id,
        completeLessons: result[0].complete_lessons,
        completeLessonIds: result[0].complete_lessons
          ? JSON.parse(result[0].complete_lesson_ids)
          : [],
      };
    } else {
      return {
        userId: userId,
        courseId: courseId,
        completeLessons: 0,
        completeLessonIds: [],
      };
    }
  } catch (err) {
    return err;
  }
};

const isUserEnrolled = async (
  userId: number,
  courseId: number
): Promise<boolean> => {
  try {
    const sql = `
    SELECT * 
    FROM course_allowed_users
    WHERE user_id = ? AND course_id = ?
    `;

    const enrollment = await pool.query(sql, [userId, courseId]);

    if (enrollment[0]) {
      return true;
    }
    return false;
  } catch (err) {
    return err;
  }
};

const enrollStudent = async (
  userId: number,
  courseId: number
): Promise<PermissionsInfo> => {
  try {
    const sql = `
    INSERT INTO course_allowed_users(user_id, course_id)
    VALUES (?, ?);
    `;

    const result = await pool.query(sql, [userId, courseId]);

    return {
      userId,
      courseId,
    };
  } catch (err) {
    return err;
  }
};

const unenrollStudent = async (
  userId: number,
  courseId: number
): Promise<PermissionsInfo> => {
  try {
    const sql = `
    DELETE 
    FROM course_allowed_users
    WHERE user_id = ? AND course_id = ?;
    `;

    const result = await pool.query(sql, [userId, courseId]);
    return {
      userId: userId,
      courseId: courseId,
    };
  } catch (err) {
    return err;
  }
};

const selfEnroll = async (
  userId: number,
  courseId: number
): Promise<InsertionReturn> => {
  try {
    const sql = `
    INSERT IGNORE INTO course_allowed_users (user_id, course_id)
    VALUES (?, ?)`;

    const result = await pool.query(sql, [userId, courseId]);

    if (result.hasOwnProperty('affectedRows')) {
      return result;
    }
    throw new Error(result);
  } catch (err) {
    return err;
  }
};

const selfUnenroll = async (
  userId: number,
  courseId: number
): Promise<InsertionReturn> => {
  try {
    const sql = `
  DELETE FROM course_allowed_users
  WHERE user_id = ? AND course_id = ?;
  `;

    const result = await pool.query(sql, [userId, courseId]);

    if (result.hasOwnProperty('affectedRows')) {
      return result;
    }
    throw new Error(result);
  } catch (err) {
    return err;
  }
};

const getEnrolledStudents = async (
  courseId: number
): Promise<UserInfoDBSafe[]> => {
  try {
    const sql = `
    SELECT users.user_id, 
          users.email, 
          users.first_name, 
          users.last_name, 
          users.birthdate, 
          users.registration_date, 
          users.role
    FROM users
    JOIN course_allowed_users ON users.user_id = course_allowed_users.user_id
    WHERE users.user_isdeactivated = 0 
    AND course_allowed_users.course_id = ?;
    `;

    const result = (await pool.query(sql, [courseId])) as UserInfoDBSafeRAW[];

    return result.map((user) => {
      return {
        userId: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        birthdate: user.birthdate,
        registrationDate: user.registration_date,
        role: user.role,
      };
    });
  } catch (err) {
    return err;
  }
};

const getUnenrolledStudents = async (
  courseId: number
): Promise<UserInfoDBSafe[]> => {
  try {
    const sql = `
    SELECT user_id, 
          email, 
          first_name, 
          last_name, 
          birthdate, 
          registration_date, 
          role
    FROM users
    WHERE user_id NOT IN (
      SELECT user_id
        FROM course_allowed_users
        WHERE course_id = ?)
    AND user_isdeactivated = 0
    AND role = 'student';
    `;

    const result = (await pool.query(sql, [courseId])) as UserInfoDBSafeRAW[];

    return result.map((user) => {
      return {
        userId: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        birthdate: user.birthdate,
        registrationDate: user.registration_date,
        role: user.role,
      };
    });
  } catch (err) {
    return err;
  }
};

const getEnrollmentRecord = async (
  userId: number,
  courseId: number
): Promise<PermissionsInfo> => {
  try {
    const sql = `
    SELECT * 
    FROM course_allowed_users
    WHERE user_id = ? AND course_id = ?
    `;

    const enrollment = await pool.query(sql, [userId, courseId]);

    if (!enrollment[0]) {
      return {
        userId: 0,
        courseId: 0,
      };
    }

    return {
      userId: enrollment[0].user_id,
      courseId: enrollment[0].course_id,
    };
  } catch (err) {
    return err;
  }
};

export const coursesData = {
  getCourseById,
  getOwnCourses,
  // getAllCourses,
  getCourseOwnerId,
  getCoursesRegisteredUser,
  getPublicCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseProgress,
  isUserEnrolled,
  enrollStudent,
  unenrollStudent,
  selfEnroll,
  selfUnenroll,
  getEnrolledStudents,
  getUnenrolledStudents,
  getEnrollmentRecord,
  getCourseAudience,
};
