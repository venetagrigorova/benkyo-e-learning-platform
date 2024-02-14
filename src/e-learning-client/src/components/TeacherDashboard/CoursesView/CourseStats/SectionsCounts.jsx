import { Link as MuiLink, makeStyles, Typography } from '@material-ui/core';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { Link } from 'react-router-dom';
import AlignedTextIcon from '../../../MicroComponents/AlignedTextIcon';

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
}));

const SectionsCount = ({ courseId, courseSectionsInfo }) => {
  const classes = useStyles();

  return courseSectionsInfo.length ? (
    <AlignedTextIcon>
      <LibraryBooksIcon />
      <Link to={`/dashboard/courses/${courseId}`} className={classes.link}>
        <Typography>{courseSectionsInfo.length} sections published</Typography>
      </Link>
    </AlignedTextIcon>
  ) : (
    <AlignedTextIcon>
      <RadioButtonUncheckedIcon />
      <Link to={`/dashboard/courses/${courseId}`} className={classes.link}>
        <Typography>Open this course to add section</Typography>
      </Link>
    </AlignedTextIcon>
  );
};

export default SectionsCount;
