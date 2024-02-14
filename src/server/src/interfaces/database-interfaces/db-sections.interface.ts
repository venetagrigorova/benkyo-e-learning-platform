/* eslint-disable camelcase */

interface SectionInfoDB {
  section_id: number;
  section_title: string;
  section_description: string;
  section_upload_date: string;
  section_date_restriction: string;
  section_last_update: string;
  section_owner_id: number;
  section_owner_first_name: string;
  section_owner_last_name: string;
  section_order: number;
}

interface SectionInfoDBLessons extends SectionInfoDB {
  section_lessons_info: string;
}

type DeleteSectionInfo = {
  sectionOwnerId: number;
  sectionId: number;
  courseId: number;
};

type SectionOwnerInfo = {
  sectionOwnerId: number;
  sectionId: number;
};

type SectionOwnerInfoDB = {
  section_owner_id: number;
  section_id: number;
};

export {
  SectionInfoDB,
  SectionInfoDBLessons,
  DeleteSectionInfo,
  SectionOwnerInfo,
  SectionOwnerInfoDB,
};
