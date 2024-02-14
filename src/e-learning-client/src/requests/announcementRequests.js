import { BASE_URL } from "../common/constants";

export const getAnnouncements = async (courseId) => {
  return fetch(`${BASE_URL}/courses/${courseId}/announcements/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then((response) => response.json());
};
export const updateAnnouncement = async (courseId, announcementData) => {
  return fetch(`${BASE_URL}/courses/${courseId}/announcements/`, {
    method: "PUT",
    headers: { 
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      announcementTitle: announcementData.announcementTitle,
      announcementContent: announcementData.announcementContent,
      announcementId: announcementData.announcementId,
      announcementCourseId: announcementData.announcementCourseId,
    })
  }).then((response) => response.json());
};

export const createAnnouncement = async (courseId, announcementData) => {
  return fetch(`${BASE_URL}/courses/${courseId}/announcements/`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      announcementTitle: announcementData.announcementTitle,
      announcementContent: announcementData.announcementContent,
      announcementCourseId: announcementData.announcementCourseId,
    })
  }).then((response) => response.json());
};

export const deleteAnnouncement = async (courseId, announcementId) => {
  return fetch(`${BASE_URL}/courses/${courseId}/announcements/${announcementId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then((response) => response.json());
};