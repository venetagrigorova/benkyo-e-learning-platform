import { Container, makeStyles, Paper, Typography } from '@material-ui/core';
import { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import BodyAttachment from '../LessonAttachments/BodyAttachment';
import NoSimIcon from '@material-ui/icons/NoSim';
import AlignedTextIcon from '../../MicroComponents/AlignedTextIcon';
import mainThemeEnum from '../../../themes/main.theme.enum';
import LessonAttachmentTabBar from './LessonAttachmentTabBar';
import InnerTabs from '../LessonAttachments/InnerTabs';

const useStyles = makeStyles((theme) => ({
  lessonAttachmentTabs: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    border: mainThemeEnum.border.bold,
  },
  bodyAttachment: {
    padding: '10px',
    maxWidth: 'inherit',
    backgroundColor: 'white',
  },
  iframeAttachments: {
    backgroundColor: 'white',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'start',
    paddingTop: theme.spacing(10),
  },
}));

const LessonAttachmentTabs = ({ body, iframes }) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const validBodyExists = body.length !== 0;
  const validiFramesExist = iframes.length !== 0;

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Paper className={classes.lessonAttachmentTabs} elevation={0}>
      <LessonAttachmentTabBar value={value} setValue={setValue} />
      <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
        {validBodyExists ? (
          <div className={classes.bodyAttachment}>
            <BodyAttachment attachment={body} />
          </div>
        ) : (
          <Container className={classes.errorContainer}>
            <AlignedTextIcon>
              <NoSimIcon />
              <Typography variant='body2'>
                This lesson has no content.
              </Typography>
            </AlignedTextIcon>
          </Container>
        )}

        {validiFramesExist ? (
          <div className={classes.iframeAttachments}>
            <InnerTabs attachments={iframes} />
          </div>
        ) : (
          <Container className={classes.errorContainer}>
            <AlignedTextIcon>
              <NoSimIcon />
              <Typography variant='body2'>
                This lesson has no attachments.
              </Typography>
            </AlignedTextIcon>
          </Container>
        )}
      </SwipeableViews>
    </Paper>
  );
};
export default LessonAttachmentTabs;
