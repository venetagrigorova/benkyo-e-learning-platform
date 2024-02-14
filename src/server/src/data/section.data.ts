import { convertUTCtoSQL } from '../common/dateUTCtoSQL.js';
import {
  SectionInfo,
  SectionInfoWithLessons,
  UpdateSectionData,
} from '../interfaces/section.interface.js';
import {
  DeleteSectionInfo,
  SectionInfoDB,
  SectionInfoDBLessons,
} from '../interfaces/database-interfaces/db-sections.interface.js';
import { InsertionReturn } from '../interfaces/database-interfaces/returns.interface.js';
import {
  NewSectionData,
  NewSectionDataWithID,
} from '../interfaces/section.interface.js';
import {
  sectionDataPreparator,
  sectionLessonsPreparator,
} from './common/section.methods.js';
import pool from './pool.js';
import { serviceErrors } from '../services/service.errors.js';

const getSectionById = async (
  sectionId: number
): Promise<SectionInfoWithLessons | undefined> => {
  try {
    const sql = `
    SELECT 
      s.section_id,
      s.section_title,
      s.section_description,
      s.section_order,
      s.section_upload_date,
      l.section_lessons_info,
      s.section_date_restriction,
      s.section_last_update,
      c.course_owner_id as section_owner_id,
      u.first_name as section_owner_first_name,
      u.last_name as section_owner_last_name
    FROM sections s
    LEFT JOIN (
      SELECT
        s.section_id as section_id,
        CONCAT('[', group_CONCAT(
        CONCAT('{"lessonId":', l.lesson_id, 
          ', "lessonTitle":"', l.lesson_title, 
          '", "lessonDescription":"', l.lesson_description, 
          '", "lessonUploadDate":"', l.lesson_upload_date, 
          '", "lessonOrder":"', l.lesson_order, 
          '", "lessonDate":"', COALESCE(l.lesson_date, ''), 
          '"}') ORDER BY l.lesson_order, l.lesson_upload_date DESC)
          , ']') as section_lessons_info
      FROM sections s
      LEFT JOIN lessons l
        ON s.section_id = l.lesson_section_id
      WHERE s.section_id = ? AND l.lesson_isdeleted = 0) l
      ON l.section_id = s.section_id
    LEFT JOIN courses c
      ON s.section_course_id = c.course_id
    LEFT JOIN users u
      ON u.user_id = c.course_owner_id
    WHERE s.section_id = ? AND s.section_isdeleted = 0
    GROUP BY s.section_id`;

    const result = (await pool.query(sql, [
      sectionId,
      sectionId,
      sectionId,
    ])) as SectionInfoDBLessons[];
    if (!result[0]) {
      return;
    }
    const preparedData = sectionLessonsPreparator(result[0]);

    return preparedData;
  } catch (err) {
    return err;
  }
};

const getSectionsByCourseId = async (
  courseId: number
): Promise<SectionInfo[] | [{}]> => {
  try {
    const sql = `
    SELECT 
      s.section_id,
      s.section_title,
      s.section_description,
      s.section_order,
      s.section_upload_date,
      s.section_date_restriction,
      s.section_last_update,
      c.course_owner_id as section_owner_id,
      u.first_name as section_owner_first_name,
      u.last_name as section_owner_last_name
    FROM sections s
    LEFT JOIN courses c
      ON s.section_course_id = c.course_id
    LEFT JOIN users u
      ON u.user_id = c.course_owner_id
    WHERE c.course_id = ?
    AND s.section_isdeleted = 0
    GROUP BY s.section_id
    ORDER BY s.section_order;
    `;

    const result = (await pool.query(sql, [courseId])) as SectionInfoDB[];

    if (!result[0]) {
      return [{}];
    }
    const preparedData = result.map((section) =>
      sectionDataPreparator(section)
    );

    return preparedData;
  } catch (err) {
    return err;
  }
};

const createSection = async (
  newSectionData: NewSectionData
): Promise<NewSectionDataWithID> => {
  try {
    const sql = `
    INSERT INTO sections (
      section_title,
      section_description,
      section_order,
      section_course_id
      ${
        newSectionData.sectionDateRestriction
          ? ', section_date_restriction'
          : ''
      })
    VALUES (
      ?, ?, ?, ?${newSectionData.sectionDateRestriction ? ', ?' : ''});
    `;

    const result = (await pool.query(sql, [
      newSectionData.sectionTitle,
      newSectionData.sectionDescription,
      newSectionData.sectionOrder,
      newSectionData.sectionCourseId,
      newSectionData.sectionDateRestriction,
    ])) as InsertionReturn;

    return {
      ...newSectionData,
      sectionId: +result.insertId,
    };
  } catch (err) {
    return err;
  }
};

const updateSection = async (
  updateSectionData: UpdateSectionData
): Promise<UpdateSectionData | number> => {
  try {
    const placeholders = [] as (string | number)[];
    const sqlSet = [] as string[];

    Object.keys(updateSectionData).forEach((key) => {
      switch (key) {
        case 'sectionTitle':
          placeholders.push(updateSectionData.sectionTitle as string);
          sqlSet.push(`section_title = ?`);
          break;
        case 'sectionDescription':
          placeholders.push(updateSectionData.sectionDescription as string);
          sqlSet.push(`section_description = ?`);
          break;
        case 'sectionDateRestriction':
          placeholders.push(
            convertUTCtoSQL(updateSectionData.sectionDateRestriction as string)
          );
          sqlSet.push(`section_date_restriction = ?`);
          break;
        case 'sectionOrder':
          placeholders.push(updateSectionData.sectionOrder as number);
          sqlSet.push(`section_order = ?`);
          break;
      }
    });

    if (!sqlSet[0]) {
      return serviceErrors.NO_MODIFICATION;
    }

    const sql = `
    UPDATE sections
    SET
      section_last_update = CURRENT_TIMESTAMP(),
      ${sqlSet.join(', ')}
    WHERE section_id = ? AND section_isdeleted = 0;
    `;

    const result = await pool.query(sql, [
      ...placeholders,
      updateSectionData.sectionId,
    ]);

    if (result.affectedRows) {
      return updateSectionData;
    }

    throw new Error('no modifications');
  } catch (err) {
    return err;
  }
};

const deleteSection = async (
  deleteInfo: DeleteSectionInfo
): Promise<InsertionReturn> => {
  try {
    const sql = `
    UPDATE sections
    SET section_isdeleted = 1
    WHERE section_id = ?;
    `;

    const result = await pool.query(sql, [deleteInfo.sectionId]);

    return result;
  } catch (err) {
    return err;
  }
};

export const sectionData = {
  getSectionById,
  getSectionsByCourseId,
  createSection,
  updateSection,
  deleteSection,
};
