import { UserCredentials } from './user-info.interface';

/* eslint-disable camelcase */
interface SectionInfo {
  sectionId: number;
  sectionTitle: string;
  sectionDescription: string;
  sectionUploadDate: string;
  sectionOwnerId: number;
  sectionDateRestriction: string | null;
  sectionOwnerFirst: string;
  sectionOwnerLast: string;
  sectionLastUpdate: string;
  sectionOrder: number;
}

interface SectionInfoWithLessons extends SectionInfo {
  sectionLessonsInfo: SectionInfoLessons[];
}

type SectionInfoLessons = {
  lessonId: number;
  lessonTitle: string;
  lessonDescription: string;
  lessonUploadDate: string;
  lessonOrder: number;
  lessonDate: string | null;
};

interface NewSectionData {
  sectionTitle: string;
  sectionDescription: string;
  sectionDateRestriction?: string;
  sectionOrder?: number;
  sectionCourseId: number;
  sectionOwnerId: number;
  sectionIsprivate: number;
}

interface NewSectionDataWithID extends NewSectionData {
  sectionId: number;
}

interface UpdateSectionData {
  sectionId: number;
  sectionTitle?: string;
  sectionDescription?: string;
  sectionDateRestriction?: string;
  sectionOrder?: number;
  user: UserCredentials;
  sectionOwnerId: number;
}

type KeysUpdateSectionData =
  | 'sectionId'
  | 'sectionTitle'
  | 'sectionDescription'
  | 'sectionOrder'
  | 'sectionDateRestriction'
  | 'sectionOwnerId';

export {
  SectionInfo,
  SectionInfoWithLessons,
  NewSectionData,
  NewSectionDataWithID,
  UpdateSectionData,
  KeysUpdateSectionData,
  SectionInfoLessons,
};
