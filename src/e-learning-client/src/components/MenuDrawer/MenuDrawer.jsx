import React from 'react';
import {
  makeStyles,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Container,
  Button,
} from '@material-ui/core';
import { Link, NavLink } from 'react-router-dom';
import mainThemeEnum from '../../themes/main.theme.enum';
import AlignedTextIcon from '../MicroComponents/AlignedTextIcon';
import NoSimIcon from '@material-ui/icons/NoSim';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  drawerContainer: {
    display: 'flex',
  },
  drawerPaper: {
    zIndex: 0,
    width: drawerWidth,
    backgroundColor: theme.palette.background.default,
    borderRight: mainThemeEnum.border.bold,
  },
  offsetDrawer: {
    marginTop: mainThemeEnum.marginNavbar(),
  },
  dashboardDrawerItem: {
    '& > *': {
      fontSize: theme.typography.fontSize * 1.5,
    },
  },
  drawerList: {
    marginTop: '-8px',
    overflow: 'hidden',
    flexGrow: 1,
  },
  drawerMenu: {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between',
    overflow: 'hidden',
    flexGrow: 1,
    // overflow: 'auto'
  },
  content: {
    width: '100%',
    flexBasis: '100%',
    padding: theme.spacing(3),
  },
  menuOption: {
    underline: 'none',
    textDecoration: 'none',
    color: 'inherit',
  },
  menuButton: {
    width: '100%',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
      background: 'rgba(0,0,0,0)',
      borderTop: mainThemeEnum.border.bold,
      borderBottom: mainThemeEnum.border.bold,
    },

    borderTop: mainThemeEnum.borderPlaceholder.bold,
    borderBottom: mainThemeEnum.borderPlaceholder.bold,
    transition: 'all 0s',
  },
  errorContainer: {
    paddingTop: theme.spacing(10),
    textAlign: 'start',
  },
  backToButton: {
    width: '100%',

    // marginBottom: '80px',
    borderTop: mainThemeEnum.border.bold,
    padding: theme.spacing(2),
    paddingRight: theme.spacing(4),
    textDecoration: 'none',

    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    transition: 'none',
  },
  backToLink: {
    textDecoration: 'none',
  },
}));

const MenuDrawer = ({
  list,
  noOffset,
  dashboard,
  children,
  lessons,
  backTo,
  backToTitle,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.drawerContainer}>
      <Drawer
        className={classes.drawer}
        variant='permanent'
        classes={{
          paper: `${classes.drawerPaper} ${
            !noOffset ? classes.offsetDrawer : ''
          }`,
        }}
      >
        <Toolbar />
        <div className={classes.drawerMenu}>
          {children ? children : <></>}
          <List className={classes.drawerList}>
            {!list || !list.length ? (
              dashboard ? (
                <Container className={classes.errorContainer}>
                  {lessons ? (
                    <Typography variant={'h6'} align={'center'}>
                      We'll show your new lesson here as soon as you submit it!
                    </Typography>
                  ) : (
                    <>
                      <Typography variant={'h6'} align={'center'} paragraph>
                        We don't have any sections to show.
                      </Typography>
                      <Typography variant={'h6'} align={'center'}>
                        Click the button above to open a new one!
                      </Typography>
                    </>
                  )}
                </Container>
              ) : (
                <Container className={classes.errorContainer}>
                  <AlignedTextIcon>
                    <NoSimIcon />
                    <Typography variant='body2'>
                      This course has no sections.
                    </Typography>
                  </AlignedTextIcon>
                </Container>
              )
            ) : (
              <>
                {list.map((element) => (
                  <Link
                    to={element.menuLink}
                    key={Math.random() + element.menuLink}
                    className={classes.menuOption}
                  >
                    <ListItem button className={classes.menuButton}>
                      <ListItemText
                        primary={element.menuTitle}
                        className={dashboard ? classes.dashboardDrawerItem : ''}
                      />
                    </ListItem>
                  </Link>
                ))}
              </>
            )}
          </List>
          {backTo ? (
            <Link to={backTo} className={classes.backToLink}>
              <Button className={classes.backToButton}>
                <ArrowLeftIcon />
                <Typography variant={'h6'}>{backToTitle}</Typography>
              </Button>
            </Link>
          ) : (
            <></>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default MenuDrawer;
