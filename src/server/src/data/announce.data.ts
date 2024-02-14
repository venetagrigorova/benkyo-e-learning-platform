import {
  AnnouncementInfo,
  DeletedAnnouncementInfo,
  NewAnnouncementData,
  NewAnnouncementDataWithID,
} from '../interfaces/course.interface';
import { AnnouncementInfoDB } from '../interfaces/database-interfaces/db-courses.interface.js';
import { InsertionReturn } from '../interfaces/database-interfaces/returns.interface.js';
import pool from './pool.js';

const createAnnouncement = async (
  newAnnouncementData: NewAnnouncementData
): Promise<NewAnnouncementDataWithID> => {
  try {
    const sql = `
    INSERT INTO announces (announce_title, announce_content, announce_course_id)
    VALUES (?, ?, ?);
    `;

    const result = (await pool.query(sql, [
      newAnnouncementData.announcementTitle,
      newAnnouncementData.announcementContent,
      newAnnouncementData.announcementCourseId,
    ])) as InsertionReturn;

    const newAnnouncement = await getAnnouncement(+result.insertId);

    return {
      ...newAnnouncementData,
      announcementId: +result.insertId,
      announcementUploadDate: newAnnouncement.announcementUploadDate,
    };
  } catch (err) {
    return err;
  }
};

const updateAnnouncement = async (
  newAnnouncementDataWithId: NewAnnouncementDataWithID
): Promise<NewAnnouncementDataWithID> => {
  try {
    const sql = `
    UPDATE announces
    SET announce_title = ?, announce_content = ?, announce_course_id = ?
    WHERE announce_id = ?;
    `;

    const result = (await pool.query(sql, [
      newAnnouncementDataWithId.announcementTitle,
      newAnnouncementDataWithId.announcementContent,
      newAnnouncementDataWithId.announcementCourseId,
      newAnnouncementDataWithId.announcementId,
    ])) as InsertionReturn;

    return {
      ...newAnnouncementDataWithId,
    };
  } catch (err) {
    return err;
  }
};

const getCourseAnnouncements = async (
  courseId: number
): Promise<AnnouncementInfo[]> => {
  try {
    const sql = `
    SELECT *
    FROM announces
    WHERE announce_course_id = ?;
    `;

    const result = (await pool.query(sql, courseId)) as AnnouncementInfoDB[];

    return result.map((announcement) => {
      return {
        announcementId: announcement.announce_id,
        announcementTitle: announcement.announce_title,
        announcementContent: announcement.announce_content,
        announcementUploadDate: announcement.announce_uploaded_date,
        announcementCourseId: announcement.announce_course_id,
      };
    });
  } catch (err) {
    return err;
  }
};

const getAnnouncement = async (
  announcementId: number
): Promise<AnnouncementInfo> => {
  try {
    const sql = `
    SELECT *
    FROM announces
    WHERE announce_id = ?;
    `;

    const result = (await pool.query(
      sql,
      announcementId
    )) as AnnouncementInfoDB[];

    return {
      announcementId: result[0].announce_id,
      announcementTitle: result[0].announce_title,
      announcementContent: result[0].announce_content,
      announcementUploadDate: result[0].announce_uploaded_date,
      announcementCourseId: result[0].announce_course_id,
    };
  } catch (err) {
    return err;
  }
};

const deleteAnnouncement = async (
  announcementId: number
): Promise<DeletedAnnouncementInfo> => {
  try {
    const sql = `
    DELETE
    FROM announces
    WHERE announce_id = ?;
    `;

    const result = (await pool.query(sql, announcementId)) as InsertionReturn;

    if (result.affectedRows === 1) {
      return { announcementId: announcementId };
    } else {
      return { announcementId: null };
    }
  } catch (err) {
    return err;
  }
};

export const announcesData = {
  createAnnouncement,
  updateAnnouncement,
  getCourseAnnouncements,
  getAnnouncement,
  deleteAnnouncement,
};
