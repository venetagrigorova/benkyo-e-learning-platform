import { makeStyles, Typography, withStyles } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import mainThemeEnum from '../../../../../themes/main.theme.enum';
import userConnectStyles from '../../../../MainNavbar/UserConnect/styles/userConnectStyles';

const useStyles = makeStyles((theme) => ({
  toggleButton: userConnectStyles.toggleButton,
  toggleGroup: {
    cursor: 'default',
  },
}));

const ModeToggle = ({ mode, handleModeToggle }) => {
  const classes = useStyles();
  const StyledToggleButton = withStyles((theme) => ({
    root: {
      '&$selected': {
        backgroundColor: theme.palette.primary.main,
        border: mainThemeEnum.border.bold,
        color: theme.palette.text.primary,

        '&:hover': {
          backgroundColor: theme.palette.primary.main,
          cursor: 'default',
        },
        transition: 'boxShadow 0s',
      },
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0)',
      },
      border: mainThemeEnum.borderPlaceholder.bold,
    },

    selected: {
      backgroundColor: theme.palette.primary.main,
    },
  }))(ToggleButton);

  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={handleModeToggle}
      className={classes.toggleGroup}
    >
      <StyledToggleButton
        value='markdown'
        aria-label='left aligned'
        className={classes.toggleButton}
      >
        <Typography>MARKDOWN</Typography>
      </StyledToggleButton>
      <StyledToggleButton
        value='html'
        aria-label='centered'
        className={classes.toggleButton}
      >
        <Typography>HTML</Typography>
      </StyledToggleButton>
    </ToggleButtonGroup>
  );
};

export default ModeToggle;
