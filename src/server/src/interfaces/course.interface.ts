import { UserCredentials } from './user-info.interface';

/* eslint-disable camelcase */
interface CourseInfo {
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  courseIsprivate: boolean;
  courseUploadDate: string;
  courseOwnerId: number;
  courseDateRestriction: string;
  courseOwnerFirst: string;
  courseOwnerLast: string;
  courseTopics?: CourseTopics[];
}

interface CourseInfoPermission extends CourseInfo {
  isEnrolled: boolean;
}

interface CourseTopics {
  topicId: number;
  topicName: string;
}

interface CourseInfoPreParsed {
  topicIds?: string;
  topicNames?: string;
}

interface CourseInfoSections extends CourseInfo {
  courseSectionsInfo: Section[];
  courseLastUpdate: string;
}

interface CourseSectionsPermission extends CourseInfoSections {
  isEnrolled: boolean;
}

type Section = {
  sectionId: number;
  sectionTitle: string;
  sectionUploadDate: string;
  sectionDateRestriction: string;
  sectionOrder: number;
};

interface NewCourseData {
  courseTitle: string;
  courseDescription: string;
  courseIsprivate: 0 | 1;
  courseDateRestriction?: 'string';
  courseOwnerId: number;
}

interface NewCourseDataWithID extends NewCourseData {
  courseId: number;
}

interface UpdateCourseData {
  courseId: number;
  courseTitle?: string;
  courseDescription?: string;
  courseIsprivate?: 0 | 1;
  courseDateRestriction?: string;
  courseOwnerId?: number;
  user: UserCredentials;
}

type KeysUpdateCourseData =
  | 'courseId'
  | 'courseTitle'
  | 'courseDescription'
  | 'courseIsprivate'
  | 'courseDateRestriction'
  | 'courseOwnerId';

interface NewAnnouncementData {
  announcementTitle: string;
  announcementContent: string;
  announcementCourseId: number;
}

interface NewAnnouncementDataWithID extends NewAnnouncementData {
  announcementId: number;
  announcementUploadDate: Date;
}

interface AnnouncementInfo {
  announcementId: number;
  announcementTitle: string;
  announcementContent: string;
  announcementUploadDate: Date;
  announcementCourseId: number;
}

interface DeletedAnnouncementInfo {
  announcementId: number | null;
}

interface CourseStats {
  userId: number;
  courseId: number;
  completeLessons: number;
  completeLessonIds: number[];
}

interface PermissionsInfo {
  userId: number;
  courseId: number;
}

interface PermissionResult {
  ok: number[];
  failed: number[];
}

export {
  CourseInfo,
  CourseInfoPermission,
  CourseInfoSections,
  CourseTopics,
  NewCourseData,
  NewCourseDataWithID,
  UpdateCourseData,
  KeysUpdateCourseData,
  NewAnnouncementData,
  NewAnnouncementDataWithID,
  AnnouncementInfo,
  DeletedAnnouncementInfo,
  CourseInfoPreParsed,
  CourseStats,
  PermissionsInfo,
  PermissionResult,
  Section,
  CourseSectionsPermission,
};
