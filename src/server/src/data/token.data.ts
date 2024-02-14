import { Console } from 'console';
import { Token } from '../interfaces/token.interface.js';
import pool from './pool.js';

const addToken = async (token: Token): Promise<string> => {
  try {
    const sql = `
      INSERT INTO tokens
      VALUE (?);
    `;

    await pool.query(sql, [token]);
    return token;
  } catch (err) {
    return err;
  }
};

const getToken = async (token: Token): Promise<string> => {
  try {
    const sql = `
      SELECT *
      FROM tokens
      WHERE token = ?;
    `;

    const result = await pool.query(sql, [token]);
    return result[0].token;
  } catch (err) {
    return err;
  }
};

const deleteToken = async (token: Token): Promise<number> => {
  try {
    const sql = `
      DELETE FROM tokens
      WHERE token = ?;
    `;

    const result = await pool.query(sql, [token]);

    return result.affectedRows;
  } catch (err) {
    return err;
  }
};

export const tokenData = {
  addToken,
  getToken,
  deleteToken,
};
