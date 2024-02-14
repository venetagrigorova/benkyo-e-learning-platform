import { makeStyles, Typography, withStyles } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import PublicIcon from '@material-ui/icons/Public';
import GroupIcon from '@material-ui/icons/Group';
import { useContext } from 'react';
import TeacherContext from '../../../../context/TeacherContext';
import fields from '../../../../common/fields.enum';

const useStyles = makeStyles((theme) => ({
  flexTextIcon: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const StyledToggleButton = withStyles((theme) => ({
  root: {
    '&$selected': {
      borderRadius: '100px',
      color: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: 'rgba(90, 168, 151, 0.12)',
      },
      transition: 'boxShadow 0s',
    },
    '&:hover': {
      borderRadius: '100px',
      backgroundColor: 'rgba(0,0,0,0)',
    },
    border: 'none',
    color: theme.palette.grey[500],
  },
  selected: {
    backgroundColor: theme.palette.primary.main,
  },
}))(ToggleButton);

const CourseAudience = ({ courseIsprivate, toggleCoursePrivacy }) => {
  const classes = useStyles();
  const { teacherState } = useContext(TeacherContext);

  return (
    <div className={classes.flexTextIcon}>
      <ToggleButtonGroup
        name={fields.courseIsprivate}
        value={courseIsprivate}
        exclusive
        onChange={toggleCoursePrivacy}
      >
        <StyledToggleButton value={false} name={fields.courseIsprivate}>
          <PublicIcon />
        </StyledToggleButton>
        <StyledToggleButton value={true} name={fields.courseIsprivate}>
          <GroupIcon />
        </StyledToggleButton>
      </ToggleButtonGroup>
      <Typography color='textSecondary'>
        This course{teacherState.isCreateOpen ? ' will be ' : ' is '}
        {courseIsprivate ? 'private' : 'public'}
      </Typography>
    </div>
  );
};

export default CourseAudience;
