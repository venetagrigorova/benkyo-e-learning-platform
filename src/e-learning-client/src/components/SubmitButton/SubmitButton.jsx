import {
  Box,
  Button,
  LinearProgress,
  Typography,
  withStyles,
} from '@material-ui/core';
import mainTheme from '../../themes/main.theme';
import mainThemeEnum from '../../themes/main.theme.enum';

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
    border: mainThemeEnum.border.medium,
  },

  disabled: {
    backgroundColor: theme.palette.background.default,
    borderColor: '#BCB6A8',
  },
}))(Button);

const SubmitButton = ({
  placeholder,
  disableIf,
  isFetching,
  button,
  onClick,
  noMargin,
  bold,
  white,
}) => {
  return (
    <Box display='flex' flexDirection='column'>
      <StyledSubmitButton
        type={button ? 'button' : 'submit'}
        disabled={disableIf || isFetching}
        onClick={onClick || (() => {})}
      >
        <Typography
          variant='h5'
          style={{
            color: white
              ? mainTheme.palette.common.white
              : mainTheme.palette.common.black,
            fontWeight: bold
              ? mainTheme.typography.fontWeightBold
              : mainTheme.typography.fontWeightMedium,
          }}
        >
          {placeholder}
        </Typography>
      </StyledSubmitButton>
      {isFetching && <LinearProgress color='secondary' />}
    </Box>
  );
};

export default SubmitButton;
