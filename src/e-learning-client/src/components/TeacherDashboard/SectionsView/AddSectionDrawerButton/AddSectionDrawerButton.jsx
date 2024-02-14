import { Box, Collapse, Fade, makeStyles, Typography } from '@material-ui/core';
import mainThemeEnum from '../../../../themes/main.theme.enum';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { useContext, useState } from 'react';
import TeacherContext from '../../../../context/TeacherContext';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '67px',
    transition: 'all .4s',
  },
  rootHidden: {
    height: '67px',

    // height: '50px',
    // transition: 'all .4s',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  collapseButtonContainer: {
    width: mainThemeEnum.sizing.menuDrawerWidth,
    height: '67px',
    zIndex: 1000,

    borderBottom: mainThemeEnum.border.bold,

    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,

    '&:hover': {
      cursor: 'pointer',
    },
  },
  collapseButtonInner: {
    width: '100%',
    height: '63px',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    padding: '0',
    fontSize: theme.typography.fontSize * 2.5,

    '&:hover': {
      cursor: 'pointer',
    },
  },
  iconContainer: {
    width: mainThemeEnum.sizing.menuDrawerWidth,
    height: '67px',
    transition: 'all 1s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  typography: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const AddSectionDrawerButton = () => {
  const { setTeacherState } = useContext(TeacherContext);
  const [activeCollapse, setActiveCollapse] = useState(false);
  const classes = useStyles();

  const hideAddCollapse = () => {
    setActiveCollapse(false);
  };

  const showAddCollapse = () => {
    setActiveCollapse(true);
  };

  const handleNewSection = () => {
    setTeacherState((previousContext) => ({
      ...previousContext,
      isCreateOpen: true,
    }));
  };

  return (
    <Box className={activeCollapse ? classes.root : classes.rootHidden}>
      <Collapse in={activeCollapse}>
        <Box
          className={classes.collapseButtonContainer}
          onMouseLeave={hideAddCollapse}
          onClick={handleNewSection}
        >
          <Box display={'flex'} className={classes.collapseButtonInner}>
            <Typography variant={'h5'} className={classes.typography}>
              ADD SECTION
            </Typography>
          </Box>
        </Box>
      </Collapse>
      <Fade in={!activeCollapse}>
        <Box
          className={`${classes.buttonContainer} ${
            activeCollapse ? classes.buttonHidden : ''
          }`}
        >
          <Box className={classes.iconContainer}>
            <AddCircleOutlineOutlinedIcon
              className={classes.icon}
              onMouseEnter={showAddCollapse}
            />
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default AddSectionDrawerButton;
