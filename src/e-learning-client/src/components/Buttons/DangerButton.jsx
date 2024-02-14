import {
  Button,
  LinearProgress,
  makeStyles,
  Typography,
  withStyles,
} from '@material-ui/core';
import { useState } from 'react';
import mainThemeEnum from '../../themes/main.theme.enum';
import FlexContainer from '../MicroComponents/FlexContainer';

const useStyles = makeStyles((theme) => ({
  buttonLabel: {
    fontWeight: theme.typography.fontWeightBold,
  },
  deleteButton: {},
  deleteButtonContainer: {
    dispaly: 'flex',
    flexDirection: 'column',
    marginRight: theme.spacing(3),
  },
}));

const DangerButton = ({
  onClick,
  isActive = true,
  placeholder,
  isFetching,
}) => {
  const [danger, setDanger] = useState(false);
  const classes = useStyles();

  const StyledSubmitButton = withStyles((theme) => ({
    root: {
      '&:hover': {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.common.white,
        fontWeight: theme.typography.fontWeightBold,
        boxShadow: `-5px 5px 0px -1px ${theme.palette.common.black}`,
        transform: 'translate(4px, -4px)',
      },
      transition: 'boxShadow 0s',
      backgroundColor: danger
        ? theme.palette.error.main
        : theme.palette.background.default,

      color: danger ? theme.palette.common.white : theme.palette.common.black,

      // margin: theme.spacing(3),
      // marginTop: theme.spacing(8),
      padding: theme.spacing(1),
      border: mainThemeEnum.border.medium,
    },

    disabled: {
      backgroundColor: theme.palette.background.default,
      borderColor: '#BCB6A8',
    },
  }))(Button);

  const handleDanger = () => {
    setDanger(!danger);
  };

  return (
    <FlexContainer>
      {danger && isActive ? (
        <div className={classes.deleteButtonContainer}>
          <StyledSubmitButton
            onClick={onClick}
            className={classes.deleteButton}
          >
            <Typography className={classes.buttonLabel}>
              {placeholder}
            </Typography>
          </StyledSubmitButton>
          {isFetching && <LinearProgress color='secondary' />}
        </div>
      ) : (
        <></>
      )}
      <StyledSubmitButton onClick={handleDanger}>
        <Typography className={classes.buttonLabel}>Danger zone</Typography>
      </StyledSubmitButton>
    </FlexContainer>
  );
};

export default DangerButton;
