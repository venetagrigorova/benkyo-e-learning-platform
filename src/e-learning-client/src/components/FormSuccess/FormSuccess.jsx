import { Box, withStyles } from '@material-ui/core';
import mainTheme from '../../themes/main.theme';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const StyledSuccessIcon = withStyles({
  root: {
    color: mainTheme.palette.secondary.main,
    fontSize: mainTheme.typography.fontSize * 5,
  },
  colorSecondary: {
    color: mainTheme.palette.error.light,
  },
})(CheckCircleIcon);

const FormSuccess = () => {
  return (
    <Box>
      <StyledSuccessIcon />
    </Box>
  );
};

export default FormSuccess;
