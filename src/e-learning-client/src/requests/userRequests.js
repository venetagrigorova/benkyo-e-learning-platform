import { BASE_URL } from '../common/constants';
import { getToken } from '../utils/token.utils';
export const getTeacher = async (userId) => {
  return fetch(`${BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then((response) => response.json());
};

export const getAllUsers = async (userId) => {
  return await fetch(`${BASE_URL}/users`, {
    method: 'GET',
    headers: {
      Authorization: `bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.errorCode) {
        throw new Error(res.errorCode);
      }
      return res.data;
    })
    .catch((err) => {});
};


export const getUser = async (userId) => {
  return fetch(`${BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then((response) => response.json());
};

export const editUser = async (userData) => {
  return fetch(`${BASE_URL}/users/${userData.userId}`, {
    method: 'PUT',
    headers: { 
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...userData
    })
  }).then((response) => response.json());
};