import { useContext, useState } from 'react';
import TeacherContext from '../../../../context/TeacherContext';
import AccordionItem from './AccordionItem';
import Pagination from '@material-ui/lab/Pagination';
import moment from 'moment';
import { Box, makeStyles } from '@material-ui/core';
import mainThemeEnum from '../../../../themes/main.theme.enum';

const useStyles = makeStyles((theme) => ({
  pageRoot: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
  pageItem: {
    '& > * > .Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      border: mainThemeEnum.border.medium,
      '&:hover': {
        cursor: 'default',
        backgroundColor: 'rgba(0,0,0,0)',
      },
    },
    '& > * > *': {
      fontSize: theme.typography.fontSize * 2,
    },
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(8),
  },
}));

const DashCoursesAccordion = () => {
  const { teacherState } = useContext(TeacherContext);
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);

  const classes = useStyles();

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      {teacherState.courses ? (
        <>
          {teacherState.courses
            .sort((a, b) =>
              Number(
                -moment
                  .utc(a.courseUploadDate)
                  .diff(moment.utc(b.courseUploadDate))
              )
            )
            .slice((page - 1) * 5, page * 5)
            .map((course, i) => (
              <AccordionItem
                course={course}
                expanded={expanded}
                setExpanded={setExpanded}
                key={'accordion' + i + course.courseTitle}
              />
            ))}
          <Box className={classes.paginationContainer}>
            <Pagination
              count={Math.ceil(teacherState.courses.length / 5)}
              page={page}
              onChange={handleChange}
              className={classes.pageRoot}
              classes={{ root: classes.pageRoot, ul: classes.pageItem }}
            />
          </Box>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default DashCoursesAccordion;
