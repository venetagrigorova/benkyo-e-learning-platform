import { makeStyles, Typography } from '@material-ui/core';
import { useContext } from 'react';
import moment from 'moment';
import TodayIcon from '@material-ui/icons/Today';
import PublishIcon from '@material-ui/icons/Publish';
import UpdateIcon from '@material-ui/icons/Update';
import LessonAttachmentTabs from '../LessonTabs/LessonAttachmentTabs';
import CourseContext from '../../../context/CourseContext';
import mainThemeEnum from '../../../themes/main.theme.enum';
import AlignedTextIcon from '../../MicroComponents/AlignedTextIcon';
import { momentFullTime, momentTime } from '../../../common/strings.enums';
const useStyles = makeStyles((theme) => ({
  content: {
    width: '100%',
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingLeft: '260px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: mainThemeEnum.marginNavbar(),
  },
  lessonContent: {
    width: '100%',
    paddingRight: '20px',
  },
  lessonInfo: {
    width: '100%',
    paddingBottom: '20px'
  },
  courseAnnouncements: {
    textAlign: 'left'
  },
  title: {
    textTransform: 'uppercase'
  },
}));

const LessonContent = ({ lessonId, sectionId }) => {
  const classes = useStyles();
  const { courseState } = useContext(CourseContext);
  
  const lesson = courseState.lessons[sectionId][lessonId];
  const { body, iframes } = lesson.lessonContent;

  const now = +new Date();
  const lessonDate = +new Date(lesson.lessonDate);
  
  return (
    <main className={classes.content}>
      <div className={classes.lessonInfo}>
        <Typography variant={'h6'} className={classes.title}>{lesson.lessonTitle}</Typography>

        <AlignedTextIcon>
          <TodayIcon></TodayIcon>
          {now > lessonDate ? (
            <Typography variant={'body2'}>
              Was held on{' '}
              {moment(lesson.lessonDate).format(momentFullTime)}
            </Typography>
          ) : null}
          {now < lessonDate ? (
            <Typography variant={'body2'}>
              Will be held on{' '}
              {moment(lesson.lessonDate).format(momentFullTime)}
            </Typography>
          ) : null}
          {now === lessonDate ? (
            <Typography variant={'body2'}>
              Held today at {moment(lesson.lessonDate).format(momentTime)}
            </Typography>
          ) : null}
        </AlignedTextIcon>

        <AlignedTextIcon>
          <PublishIcon></PublishIcon>
          <Typography variant={'body2'}>
            Uploaded on{' '}
            {moment(lesson.lessonUploadDate).format(momentFullTime)}
          </Typography>
        </AlignedTextIcon>

        <AlignedTextIcon>
          {lesson.lessonLastUpdate ? (
            <>
              <UpdateIcon></UpdateIcon>
              <Typography variant={'body2'}>
                Last updated on{' '}
                {moment(lesson.lessonLastUpdate).format(momentFullTime)}
              </Typography>
            </>
          ) : null}
        </AlignedTextIcon>
      </div>

      <div className={classes.lessonContent}>
        <LessonAttachmentTabs body={body} iframes={iframes} />
      </div>
      
    </main>
  );
};

export default LessonContent;
