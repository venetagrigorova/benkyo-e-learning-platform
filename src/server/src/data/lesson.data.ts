import {LessonInfoDBOwnerId} from './../interfaces/database-interfaces/db-lessons.interface.js';
import {
  LessonInfo,
  LessonInfoCourseOwnerId,
  UpdateLessonDataWithID,
} from '../interfaces/lesson.info.interface';
import { convertUTCtoSQL } from '../common/dateUTCtoSQL.js';
import { InsertionReturn } from '../interfaces/database-interfaces/returns.interface.js';
import {
  NewLessonData,
  NewLessonDataWithID,
} from '../interfaces/lesson.info.interface';
import { lessonOwnerIdPreparator } from './common/lessons.methods.js';
import pool from './pool.js';

const createLesson = async (
  newLessonData: NewLessonData
): Promise<NewLessonDataWithID> => {
  try {
    const sql = `
    INSERT INTO lessons (lesson_title, lesson_description, lesson_order, lesson_content, lesson_section_id${
      newLessonData.lessonDate ? ', lesson_date' : ''
    })
    VALUES (?, ?${newLessonData.lessonDate ? ', ?' : ''}, ?, ?, ?)
    `;

    const result = (await pool.query(sql, [
      newLessonData.lessonTitle,
      newLessonData.lessonDescription,
      newLessonData.lessonOrder,
      newLessonData.lessonContent,
      newLessonData.lessonSectionId,
      newLessonData.lessonDate,
    ])) as InsertionReturn;

    return {
      ...newLessonData,
      lessonId: +result.insertId,
      lessonContent: JSON.parse(newLessonData.lessonContent),
    };
  } catch (err) {
    return err;
  }
};

const updateLesson = async (
  updateLessonData: UpdateLessonDataWithID
): Promise<UpdateLessonDataWithID | undefined> => {
  try {
    const placeholders = [] as (string | number)[];
    const sqlSet = [] as string[];

    Object.keys(updateLessonData).forEach((key) => {
      switch (key) {
        case 'lessonTitle':
          placeholders.push(updateLessonData.lessonTitle as string);
          sqlSet.push(`lesson_title = ?`);
          break;
        case 'lessonDescription':
          placeholders.push(updateLessonData.lessonDescription as string);
          sqlSet.push(`lesson_description = ?`);
          break;
        case 'lessonOrder':
          placeholders.push(updateLessonData.lessonOrder as number);
          sqlSet.push(`lesson_order = ?`);
          break;
        case 'lessonDate':
          placeholders.push(
            convertUTCtoSQL(updateLessonData.lessonDate as string)
          );
          sqlSet.push(`lesson_date = ?`);
          break;
        case 'lessonContent':
          placeholders.push(updateLessonData.lessonContent as string);
          sqlSet.push(`lesson_content = ?`);
          break;
        case 'lessonSectionId':
          placeholders.push(updateLessonData.lessonSectionId as number);
          sqlSet.push(`lesson_section_id = ?`);
          break;
      }
    });

    const sql = `
    UPDATE lessons
    SET
      lesson_last_update = CURRENT_TIMESTAMP(),
      ${sqlSet.join(', ')}
    WHERE lesson_id = ? AND lesson_isdeleted = 0;
    `;

    const result = await pool.query(sql, [
      ...placeholders,
      updateLessonData.lessonId,
    ]);

    if (result.affectedRows) {
      return updateLessonData;
    }
    return;
  } catch (err) {
    return err;
  }
};

const getLesson = async (
  lessonId: number
): Promise<LessonInfoCourseOwnerId | undefined> => {
  try {
    const sql = `
    SELECT l.lesson_id, 
      l.lesson_title, 
      l.lesson_description, 
      l.lesson_order,
      l.lesson_upload_date, 
      l.lesson_date, 
      l.lesson_last_update, 
      l.lesson_content, 
      l.lesson_isdeleted, 
      l.lesson_section_id,
      c.course_owner_id
    FROM lessons l
    LEFT JOIN sections s
    ON s.section_id = l.lesson_section_id
    LEFT JOIN courses c
    ON c.course_id = s.section_course_id
    WHERE l.lesson_id = ?
    AND l.lesson_isdeleted = 0;
    `;

    const result = (await pool.query(sql, [lessonId])) as LessonInfoDBOwnerId[];

    if (!result[0]) {
      return;
    }
    const preparedData = lessonOwnerIdPreparator(result[0]);
    return preparedData;
  } catch (err) {
    return err;
  }
};

const getLessons = async (
  courseId: number,
  sectionId: number
): Promise<LessonInfoCourseOwnerId[] | [{}]> => {
  try {
    const sql = `
    SELECT l.lesson_id, 
      l.lesson_title, 
      l.lesson_description, 
      l.lesson_order,
      l.lesson_upload_date, 
      l.lesson_date, 
      l.lesson_content, 
      l.lesson_last_update, 
      l.lesson_isdeleted, 
      l.lesson_section_id,
      c.course_owner_id
    FROM lessons l
    LEFT JOIN sections s
    ON s.section_id = l.lesson_section_id
    LEFT JOIN courses c
    ON c.course_id = s.section_course_id
    WHERE c.course_id = ?
    AND s.section_id = ?
    AND l.lesson_isdeleted = 0
    ORDER BY l.lesson_order;
    `;

    const result = (await pool.query(sql, [
      courseId,
      sectionId,
    ])) as LessonInfoDBOwnerId[];

    if (!result) {
      return [{}];
    }
    const preparedData = result.map((lesson) =>
      lessonOwnerIdPreparator(lesson)
    );

    return preparedData;
  } catch (err) {
    return err;
  }
};

const deleteLesson = async (lessonId: number): Promise<InsertionReturn | null> => {
  try {
    const sql = `
    UPDATE lessons
    SET lesson_isdeleted = 1
    WHERE lesson_id = ?;
    `;

    const result = (await pool.query(sql, [lessonId])) as InsertionReturn;

    if (result.affectedRows === 1) {
      return result;
    } else {
      return null;
    }
  } catch (err) {
    return err;
  }
};

const addLessonStats = async (
  userId: number, 
  lessonId: number
): Promise<InsertionReturn | null> => {
  try {
    const sql = `
    INSERT INTO lesson_stats (user_id, lesson_id)
    VALUES (?, ?)
    `;

    const result = (await pool.query(sql, [userId, lessonId])) as InsertionReturn;

    if (result.affectedRows === 1) {
      return result;
    } else {
      return null;
    }
  } catch (err) {
    return err;
  }
};

const deleteLessonStats = async (
  userId: number,
  lessonId: number
): Promise<InsertionReturn | null> => {
  try {
    const sql = `
    DELETE
    FROM lesson_stats
    WHERE user_id = ?
    AND lesson_id = ?;
    `;

    const result = (await pool.query(sql, [userId, lessonId])) as InsertionReturn;
    

    if (result.affectedRows === 1) {
      return result;
    } else {
      return null;
    }
  } catch (err) {
    return err;
  }
};


export const lessonsData = {
  createLesson,
  updateLesson,
  getLesson,
  getLessons,
  deleteLesson,
  addLessonStats,
  deleteLessonStats,
};
