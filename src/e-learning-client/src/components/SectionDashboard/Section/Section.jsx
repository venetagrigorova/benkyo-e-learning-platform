import { Container, makeStyles, Typography } from '@material-ui/core';
import { useContext } from 'react';
import CourseContext from '../../../context/CourseContext';
import Lessons from '../Lessons/Lessons';
import AlignedTextIcon from '../../MicroComponents/AlignedTextIcon';
import NoSimIcon from '@material-ui/icons/NoSim';
import mainThemeEnum from '../../../themes/main.theme.enum';
import parse from 'html-react-parser';
import Announcements from '../../Announcements/Announcements';
import PublishIcon from '@material-ui/icons/Publish';
import UpdateIcon from '@material-ui/icons/Update';
import LockIcon from '@material-ui/icons/Lock';
import moment from 'moment';
import { momentFullTime } from '../../../common/strings.enums';

const useStyles = makeStyles((theme) => ({
  content: {
    width: '100%',
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: mainThemeEnum.marginNavbar(),
    paddingLeft: '260px',
  },
  sectionDrawerContent: {
    width: '100%',
    flexGrow: 1,
    display: 'flex',
  },
  sectionsInfo: {
    width: '30%',
  },
  lessonsList: {
    width: '70%',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'start',
    padding: '20%'
  },
}));

const SectionContent = ({ sectionId }) => {
  const classes = useStyles();
  const { courseState } = useContext(CourseContext);

  const section = courseState.sections[sectionId];
  const lessons = courseState.sortedLessons[sectionId];

  return (
    <main className={classes.content}>
      <div className={classes.sectionDrawerContent}>

        <div className={classes.lessonsList}>
          {lessons.length !== 0 ? (
            <Lessons
              key={sectionId}
              lessons={lessons}
              courseId={courseState.course.courseId}
              sectionId={sectionId}
            />
          ) : (
            <Container className={classes.errorContainer}>
              <AlignedTextIcon>
                <NoSimIcon />
                <Typography variant="body2">
                  This section has no lessons.
                </Typography>
              </AlignedTextIcon>
            </Container>
          )}
        </div>

        <div className={classes.sectionsInfo}>
          <Typography variant={"h6"} className={classes.title}>
            {section.sectionTitle}
          </Typography>

          <AlignedTextIcon>
            <PublishIcon></PublishIcon>
            <Typography variant={"body2"}>
              Uploaded on{" "}
              {moment(section.sectionUploadDate).format(momentFullTime)}
            </Typography>
          </AlignedTextIcon>

          
            {section.sectionLastUpdate ? (
              <AlignedTextIcon>
                <UpdateIcon></UpdateIcon>
                <Typography variant={"body2"}>
                  Last updated on{" "}
                  {moment(section.sectionLastUpdate).format(momentFullTime)}
                </Typography>
              </AlignedTextIcon>
            ) : null}
          
            {moment(section.sectionDateRestriction).isAfter() ? (
              <AlignedTextIcon>
                <LockIcon/>
                <Typography variant={"body2"}>
                  Section restricted until{" "}
                  {moment(section.sectionDateRestriction).format(momentFullTime)}
                </Typography>
              </AlignedTextIcon>
            ) : null}

          <Typography className={classes.sectionDescription} variant={"body1"}>
            {parse(section.sectionDescription)}
          </Typography>

          <div className={classes.courseAnnouncements}>
            <Typography variant={"h6"} className={classes.title}>
              Announcements
            </Typography>
            <Announcements />
          </div>
        </div>
        
      </div>
    </main>
  );
};

export default SectionContent;
