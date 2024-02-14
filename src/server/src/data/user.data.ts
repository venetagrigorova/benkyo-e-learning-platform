import { EditUserInfo } from './../interfaces/user-info.interface';
/* eslint-disable max-len */
import { EmailId } from '../common/user-roles.enum.js';
import {
  UserInfoDBPasswordRAW,
  UserInfoDBSafeRAW,
} from '../interfaces/database-interfaces/db-users.interface.js';
import { InsertionReturn } from '../interfaces/database-interfaces/returns.interface.js';
import {
  NewUserWithRole,
  UserInfoDBPassword,
  UserInfoDBSafe,
} from '../interfaces/user-info.interface.js';
import pool from './pool.js';

const createUser = async (
  user: NewUserWithRole
): Promise<UserInfoDBPassword> => {
  try {
    const sql = `
    INSERT INTO users(email, first_name, last_name, password, birthdate, role)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

    const result = await pool.query(sql, [
      user.email,
      user.firstName,
      user.lastName,
      user.password,
      user.birthdate,
      user.role,
    ]);

    return getUserInfo(EmailId.USERID, result.insertId);
  } catch (err) {
    return err;
  }
};

const editUser = async (user: EditUserInfo): Promise<UserInfoDBSafe | null> => {
  try {
    const sql = `
    UPDATE users
    SET email = ?, first_name = ?, last_name = ?, birthdate = ?
    WHERE user_id = ?
  `;

    const result = (await pool.query(sql, [
      user.email,
      user.firstName,
      user.lastName,
      user.birthdate,
      user.userId,
    ])) as InsertionReturn;

    if (result.affectedRows === 1) {
      return getUser(user.userId);
    } else {
      return null;
    }
  } catch (err) {
    return err;
  }
};

const getUser = async (userId: number): Promise<UserInfoDBSafe | null> => {
  try {
    const sql = `
        SELECT *
        FROM users
        WHERE user_id = ?
        AND user_isdeactivated = 0;
        `;

    const result = await pool.query(sql, [userId]);
    if (result[0]) {
      const user = result[0] as UserInfoDBSafeRAW;
      return {
        userId: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        birthdate: user.birthdate,
        registrationDate: user.registration_date,
        role: user.role,
      };
    } else {
      return null;
    }
  } catch (err) {
    return err;
  }
};

const getUserInfo = async (
  column: EmailId,
  value: number | string
): Promise<UserInfoDBPassword> => {
  try {
    const sql = `
        SELECT *
        FROM users
        WHERE ${
          column === 'email' ? 'email' : column === 'userId' && 'user_id'
        } = ?
          AND user_isdeactivated = 0;
        `;

    const result = await pool.query(sql, [value]);
    const user = result[0] as UserInfoDBPasswordRAW;
    return {
      userId: user.user_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      password: user.password,
      birthdate: user.birthdate,
      registrationDate: user.registration_date,
      role: user.role,
    };
  } catch (err) {
    return err;
  }
};

const getUserBaseInfo = async (user_id: number): Promise<UserInfoDBSafe[]> => {
  try {
    const sql = `
    SELECT 
      user_id,
      email,
      first_name,
      last_name,
      birthdate,
      registration_date,
      role
    FROM users
    WHERE user_isdeactivated = 0 
    AND user_id = ?;
    `;

    const result = (await pool.query(sql, user_id)) as UserInfoDBSafeRAW[];

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

const getAllUsersBaseInfo = async (): Promise<UserInfoDBSafe[]> => {
  try {
    const sql = `
    SELECT 
      user_id,
      email,
      first_name,
      last_name,
      birthdate,
      registration_date,
      role
    FROM users
    WHERE user_isdeactivated = 0;
    `;

    const result = (await pool.query(sql)) as UserInfoDBSafeRAW[];

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

export const userData = {
  createUser,
  getUser,
  getUserInfo,
  getAllUsersBaseInfo,
  getUserBaseInfo,
  editUser,
};
