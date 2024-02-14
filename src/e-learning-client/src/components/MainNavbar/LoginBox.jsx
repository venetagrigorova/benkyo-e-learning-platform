import { Box, Button, makeStyles, Modal, Typography } from '@material-ui/core';
import { useState } from 'react';
import mainTheme from '../../themes/main.theme';
import mainThemeEnum from '../../themes/main.theme.enum';
import UserConnect from './UserConnect';
import buttonStyles from './UserConnect/styles/buttonStyles';

const useStyles = makeStyles({
  login: {
    ...buttonStyles.jumpShadowGreen,
    border: mainThemeEnum.borderGreen.medium,
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: mainTheme.typography.fontWeightMedium,
    fontSize: mainTheme.typography.fontSize * 1.2,
  },
  loginButton: {
    margin: mainTheme.spacing(2),
    color: mainTheme.palette.primary.main,
  },
  mainModal: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const LoginBox = () => {
  const classes = useStyles();
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const handleOpenLoginModal = () => {
    setOpenLoginModal(true);
  };
  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };

  return (
    <Box className={classes.loginButton}>
      <Button
        color='primary'
        className={classes.login}
        onClick={handleOpenLoginModal}
      >
        <Typography variant='h5'>Login</Typography>
      </Button>
      <Modal
        open={openLoginModal}
        className={classes.mainModal}
        onClose={handleCloseLoginModal}
        elevation={0}
      >
        <UserConnect />
      </Modal>
    </Box>
  );
};

export default LoginBox;
