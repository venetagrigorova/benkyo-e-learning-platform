import { Box, Collapse, Fab, makeStyles, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import mainThemeEnum from '../../themes/main.theme.enum';
import parse from 'html-react-parser';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  descriptionContainer: {
    position: 'relative',
  },
  expandIconContainer: {
    background: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
    border: mainThemeEnum.border.medium,
    padding: theme.spacing(1),
    transition: 'boxShadow 0s',
  },
  fadeBarShow: {
    position: 'absolute',
    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), ${theme.palette.background.default})`,
    width: '100%',
    height: '100px',
    display: 'flex',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    justifyContent: 'center',
    bottom: '0px',
  },
  fadeBarHide: {
    display: 'flex',
    justifyContent: 'center',
  },
  iconRotated: {
    transform: 'rotate(180deg)',
    transition: 'transform .4s',
  },
}));

const CollapseText = ({ textContent }) => {
  const [isCollapsed, setCollapsed] = useState(false);
  const classes = useStyles();

  const handleToggleCollapse = () => {
    setCollapsed(!isCollapsed);
  };

  return (
    <div className={classes.descriptionContainer}>
      <Collapse in={isCollapsed} collapsedSize={100}>
        <Typography paragraph align='justify' component={Box}>
          {parse(textContent)}
        </Typography>
      </Collapse>
      <div className={isCollapsed ? classes.fadeBarHide : classes.fadeBarShow}>
        <Fab
          size='small'
          className={classes.expandIconContainer}
          onClick={handleToggleCollapse}
        >
          <ExpandMoreIcon
            className={`{classes.expandIcon} ${
              isCollapsed ? classes.iconRotated : ''
            }`}
          />
        </Fab>
      </div>
    </div>
  );
};
export default CollapseText;
