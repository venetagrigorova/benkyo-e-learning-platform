import { Box, makeStyles, Typography } from '@material-ui/core';
import parse from 'html-react-parser';
import Showdown from 'showdown';
import MakePanel from '../Utils/MakePanel';
import sanitizeHtml from 'sanitize-html';
const converter = new Showdown.Converter();

const useStyles = makeStyles((theme) => ({
  previewContainer: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
}));

const PreviewTab = ({ lessonBody = '' }) => {
  const classes = useStyles();

  return (
    <MakePanel>
      <Box className={classes.previewContainer}>
        <Typography component={Box}>
          {parse(
            sanitizeHtml(converter.makeHtml(lessonBody), {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
              allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ['src', 'alt'],
              },
            })
          )}
        </Typography>
      </Box>
    </MakePanel>
  );
};

export default PreviewTab;
