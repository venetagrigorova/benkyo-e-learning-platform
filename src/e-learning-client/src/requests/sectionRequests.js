import { BASE_URL } from "../common/constants";

export const getSection = async (courseId, sectionId) => {
  return fetch(`${BASE_URL}/courses/${courseId}/sections/${sectionId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then((response) => response.json());
};

export const getSections = async (courseId) => {
  return fetch(`${BASE_URL}/courses/${courseId}/sections/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then((response) => response.json());
}