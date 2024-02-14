import { LessonInfoCourseOwnerId } from '../../interfaces/lesson.info.interface';
import {
  AnnouncementInfo,
  CourseInfo,
  CourseStats,
  DeletedAnnouncementInfo,
  NewAnnouncementDataWithID,
  NewCourseDataWithID,
  PermissionResult,
  PermissionsInfo,
} from '../../interfaces/course.interface';
import { InsertionReturn } from '../../interfaces/database-interfaces/returns.interface';
import { NewLessonDataWithID } from '../../interfaces/lesson.info.interface';
import {
  UserInfoDBPassword,
  UserInfoDBSafe,
} from '../../interfaces/user-info.interface';
import {
  NewSectionDataWithID,
  SectionInfo,
  SectionInfoLessons,
  SectionInfoWithLessons,
} from '../../interfaces/section.interface';
import { Result, ValidationError } from 'express-validator';
import { TopicInfo } from '../../interfaces/topic.interface';
import {
  CourseOwnerInfo,
  CoursePrivacyInfo,
} from '../../interfaces/database-interfaces/db-courses.interface';

export interface ApiError {
  errorCode: number;
  data: Data | undefined;
}

export interface ApiSuccess {
  errorCode: null;
  data: Data;
}

export type Data =
  | string
  | boolean
  | InsertionReturn
  | UserInfoDBPassword
  | UserInfoDBSafe
  | UserInfoDBSafe[]
  | CourseInfo[]
  | CourseStats
  | NewCourseDataWithID
  | TopicInfo[]
  | AnnouncementInfo[]
  | NewAnnouncementDataWithID
  | DeletedAnnouncementInfo
  | NewSectionDataWithID
  | NewLessonDataWithID
  | PermissionsInfo[]
  | PermissionsInfo
  | PermissionResult[]
  | PermissionResult
  | CourseOwnerInfo
  | LessonInfoCourseOwnerId
  | LessonInfoCourseOwnerId[]
  | SectionInfoLessons
  | SectionInfoWithLessons
  | SectionInfo[]
  | CoursePrivacyInfo
  | Result<ValidationError>
  | [{}];
