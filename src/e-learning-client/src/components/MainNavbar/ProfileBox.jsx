import {
  Button,
  ClickAwayListener,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp';
import mainTheme from '../../themes/main.theme';
import mainThemeEnum from '../../themes/main.theme.enum';
import { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../context/AuthContext';

const useStyles = makeStyles({
  profileIcon: {
    fontSize: mainTheme.typography.fontSize * 3,
    marginLeft: mainTheme.spacing(2),
  },
  profileBox: {
    display: 'flex',
    alignItems: 'center',
  },
  dropdownMenu: {
    marginTop: mainTheme.spacing(1),
    backgroundColor: mainTheme.palette.background.default,
    border: mainThemeEnum.border.bold,
  },
  profileDropdownButton: {
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: mainTheme.palette.background.default,
    },
    transition: 'all 0s',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
});

const ProfileBox = () => {
  const classes = useStyles();
  const { accountState } = useContext(AuthContext);
  const isTeacher = accountState.role === 'teacher';
  const [openProfileDropdown, setOpenProfileDropdown] = useState(false);
  const anchorRefProfile = useRef(null);

  const handleToggleProfileDropdown = () => {
    setOpenProfileDropdown((prevOpen) => !prevOpen);
  };

  const handleCloseProfileDropdown = (event) => {
    if (
      anchorRefProfile.current &&
      anchorRefProfile.current.contains(event.target)
    ) {
      return;
    }

    setOpenProfileDropdown(false);
  };

  const handleListKeyDownProfileDropdown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenProfileDropdown(false);
    }
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(openProfileDropdown);
  useEffect(() => {
    if (prevOpen.current === true && openProfileDropdown === false) {
      anchorRefProfile.current.focus();
    }

    prevOpen.current = openProfileDropdown;
  }, [openProfileDropdown]);

  return (
    <div className={classes.profileBox}>
      <Button className={classes.profileDropdownButton}>
        <AccountCircleSharpIcon
          ref={anchorRefProfile}
          onClick={handleToggleProfileDropdown}
          className={classes.profileIcon}
        />
      </Button>
      <Popper
        open={openProfileDropdown}
        anchorEl={anchorRefProfile.current}
        role={undefined}
        transition
        disablePortal
        placement='bottom-end'
        className={classes.dropdownMenuPopper}
      >
        <Paper className={classes.dropdownMenu} elevation={0}>
          <ClickAwayListener onClickAway={handleCloseProfileDropdown}>
            <MenuList
              autoFocusItem={openProfileDropdown}
              id='menu-list-grow'
              onKeyDown={handleListKeyDownProfileDropdown}
            >
              <MenuItem onClick={handleCloseProfileDropdown}>
                <Link className={classes.link} to={'/profile'}>
                  <Typography>My Account</Typography>
                </Link>
              </MenuItem>
              {isTeacher ? (
                <MenuItem onClick={handleCloseProfileDropdown}>
                  <Link className={classes.link} to={'/mycourses'}>
                    <Typography>My Courses</Typography>
                  </Link>
                </MenuItem>
              ) : (
                []
              )}
              <LogoutButton />
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </div>
  );
};

export default ProfileBox;
