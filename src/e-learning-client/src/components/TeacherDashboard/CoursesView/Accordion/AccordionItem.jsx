import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import mainThemeEnum from '../../../../themes/main.theme.enum';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import BookIcon from '@material-ui/icons/Book';
import moment from 'moment';
import { useContext, useState } from 'react';
import CatalogueContext from '../../../../context/CatalogueContext';
import CoursePreview from './CoursePreview/CoursePreview';

const useStyles = makeStyles((theme) => ({
  accordionItem: {
    border: mainThemeEnum.border.bold,
    marginBottom: theme.spacing(2),
    minHeight: '72px',
  },
  flexColumn: {
    display: 'flex',
  },
  detailField: {
    marginRight: theme.spacing(0.5),
  },
  coloredIcon: {
    color: theme.palette.primary.main,
  },
  flexTextIcon: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary,
    flexShrink: 1,
    '& > svg': {
      fontSize: theme.typography.fontSize * 1.3,
      marginRight: theme.spacing(0.5),
    },
  },
  inlineLink: {
    cursor: 'pointer',
    textDecoration: 'none',
  },

  title: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const AccordionItem = ({ course, expanded, setExpanded }) => {
  const { topics } = useContext(CatalogueContext).catalogueState;
  const [isEdit, setEdit] = useState(false);
  const classes = useStyles();
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const { courseId, courseTitle, courseUploadDate, courseLastUpdate } = course;

  return (
    <>
      <Accordion
        expanded={expanded === courseId}
        onChange={handleChange(courseId)}
        className={classes.accordionItem}
        elevation={0}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon classes={{ root: classes.coloredIcon }} />
          }
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div className={classes.flexTextIcon}>
                <Typography variant={'h5'} className={classes.title}>
                  {courseTitle}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className={classes.flexTextIcon}>
                <BookIcon />
                <Typography>
                  Created on {moment(courseUploadDate).format('MMMM Do YYYY')}
                </Typography>
              </div>

              {courseLastUpdate && (
                <div className={classes.flexTextIcon}>
                  <AutorenewIcon />
                  <Typography>
                    Last updated {moment(courseLastUpdate).fromNow()}
                  </Typography>
                </div>
              )}
            </Grid>
          </Grid>
        </AccordionSummary>

        <AccordionDetails>
          <CoursePreview course={course} isEdit={isEdit} setEdit={setEdit} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default AccordionItem;
