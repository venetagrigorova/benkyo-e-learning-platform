import { convertUTCtoSQL } from '../../common/dateUTCtoSQL.js';
import {
  SectionInfoLessons,
  SectionInfoWithLessons,
} from '../../interfaces/section.interface.js';
import {
  SectionInfoDB,
  SectionInfoDBLessons,
} from '../../interfaces/database-interfaces/db-sections.interface.js';
import { SectionInfo } from '../../interfaces/section.interface.js';

const sectionDataPreparator = (section: SectionInfoDB): SectionInfo => {
  const sectionPrepared = {
    sectionId: section.section_id,
    sectionTitle: section.section_title,
    sectionDescription: section.section_description,
    sectionUploadDate: section.section_upload_date,
    sectionDateRestriction: section.section_date_restriction,
    sectionOwnerId: section.section_owner_id,
    sectionOwnerFirst: section.section_owner_first_name,
    sectionOwnerLast: section.section_owner_last_name,
    sectionLastUpdate: section.section_last_update,
    sectionOrder: section.section_order,
  };

  return sectionPrepared;
};

const sectionLessonsPreparator = (
  section: SectionInfoDBLessons
): SectionInfoWithLessons => {
  const final = {
    ...sectionDataPreparator(section),
    // sectionOrder: section.section_order,
    sectionLessonsInfo:
      (JSON.parse(section.section_lessons_info) as SectionInfoLessons[]) || [],
  };

  final.sectionLessonsInfo.forEach((lesson) => {
    if (lesson.lessonDate === '') {
      lesson.lessonDate = null;
    }
  });

  return final;
};

export { sectionDataPreparator, sectionLessonsPreparator };
