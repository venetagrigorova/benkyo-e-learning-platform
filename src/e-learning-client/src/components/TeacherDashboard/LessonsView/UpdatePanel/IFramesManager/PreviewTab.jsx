import { Box, makeStyles } from '@material-ui/core';
import InnerTabs from '../../../../LessonDashboard/LessonAttachments/InnerTabs';
import MakePanel from '../Utils/MakePanel';

const useStyles = makeStyles((theme) => ({}));

const PreviewTab = ({ lessonIframes }) => {
  const classes = useStyles();

  return (
    <MakePanel>
      <Box className={classes.previewContainer}>
        <InnerTabs attachments={lessonIframes} />
      </Box>
    </MakePanel>
  );
};

export default PreviewTab;
