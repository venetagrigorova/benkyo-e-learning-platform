import { BASE_URL } from '../common/constants';

export const getCourse = async (courseId) => {
  return fetch(`${BASE_URL}/courses/${courseId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then((response) => response.json());
};

export const getCourseProgressByUserId = async (userId, courseId) => {
  return fetch(`${BASE_URL}/courses/${courseId}/progress`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({
      userId
    }),
  }).then((response) => response.json());
};
