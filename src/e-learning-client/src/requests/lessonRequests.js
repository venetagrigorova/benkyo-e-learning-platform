import { BASE_URL } from "../common/constants";

export const getLesson = async (courseId, sectionId, lessonId) => {
  return fetch(`${BASE_URL}/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then((response) => response.json());
};

export const getLessons = async (courseId, sectionId) => {
  return fetch(`${BASE_URL}/courses/${courseId}/sections/${sectionId}/lessons/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then((response) => response.json());
}

export const isLessonComplete = async (courseId, sectionId, lessonId) => {
  return fetch(`${BASE_URL}/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/status`, {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then((response) => response.json());
};

export const markLessonComplete = async (courseId, sectionId, lessonId) => {
  return fetch(`${BASE_URL}/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/complete`, {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then((response) => {
    return response.json();
  });
};

export const markLessonIncomplete = async (courseId, sectionId, lessonId) => {
  return fetch(`${BASE_URL}/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/incomplete`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then((response) => {
    return response.json();
  });
};