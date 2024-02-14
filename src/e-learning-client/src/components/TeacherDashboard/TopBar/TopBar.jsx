import {
  Box,
  Button,
  makeStyles,
  Typography,
  withStyles,
} from '@material-ui/core';
import { useContext } from 'react';
import TeacherContext from '../../../context/TeacherContext';
import mainThemeEnum from '../../../themes/main.theme.enum';
import FlexContainer from '../../MicroComponents/FlexContainer';

const useStyles = makeStyles((theme) => ({
  topBar: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
  mainHeader: {
    userSelect: 'none',
  },
  headerButton: {
    minWidth: '170px',
    color: theme.palette.common.white,
    fontSize: theme.typography.fontSize * 1.5,
    fontWeight: theme.typography.fontWeightBold,
  },
  hidden: {
    visibility: 'hidden',
  },
}));

export const StyledSubmitButton = withStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      boxShadow: `-5px 5px 0px -1px ${theme.palette.common.black}`,
      transform: 'translate(4px, -4px)',
    },
    transition: 'boxShadow 0s',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    border: mainThemeEnum.border.bold,
  },

  disabled: {
    backgroundColor: theme.palette.background.default,
    borderColor: '#BCB6A8',
  },
}))(Button);

const TopBar = ({ style = {}, section = false }) => {
  const classes = useStyles();
  const { teacherState, setTeacherState } = useContext(TeacherContext);

  return (
    <Box
      className={classes.topBar}
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      style={style}
    >
      <Box>
        <FlexContainer>
          <StyledSubmitButton
            className={`${classes.headerButton} ${classes.hidden}`}
          >
            Your profile
          </StyledSubmitButton>
        </FlexContainer>
      </Box>
      <Box>
        <FlexContainer>
          <Typography variant={'h2'} className={classes.mainHeader}>
            {teacherState.isCreateOpen
              ? section
                ? 'Add a section'
                : 'Create a course'
              : section
              ? 'Sections'
              : 'Your courses'}
          </Typography>
        </FlexContainer>
      </Box>
      <Box>
        <FlexContainer>
          <div>
            <StyledSubmitButton
              className={classes.headerButton}
              onClick={() =>
                setTeacherState({
                  ...teacherState,
                  isCreateOpen: !teacherState.isCreateOpen,
                })
              }
            >
              {teacherState.isCreateOpen
                ? 'Close'
                : section
                ? 'New section'
                : 'New course'}
            </StyledSubmitButton>
          </div>
        </FlexContainer>
      </Box>
    </Box>
  );
};

export default TopBar;
