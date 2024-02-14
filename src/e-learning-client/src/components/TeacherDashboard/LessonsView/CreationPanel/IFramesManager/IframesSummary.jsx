import {
  Box,
  makeStyles,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import mainThemeEnum from '../../../../../themes/main.theme.enum';
import { parseHTML, getInfoHTML } from '../../../../../utils/helpers';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CropPortraitSharpIcon from '@material-ui/icons/CropPortraitSharp';
import CropLandscapeSharpIcon from '@material-ui/icons/CropLandscapeSharp';

const useStyles = makeStyles((theme) => ({
  deleteIcon: {
    cursor: 'pointer',
  },
  selectDisplay: {
    border: 'none',
    fontSize: theme.typography.fontSize * 1.6,
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
    '&': {
      border: '0px',
    },
  },
  orderSelect: {
    border: 'none',
  },
  orderField: {
    fontSize: theme.typography.fontSize * 1.4,
  },
  iframeContainer: {
    display: 'flex',
    margin: theme.spacing(2),
  },
  noBorder: {
    border: '0',
  },
  selectMenu: {
    '& .MuiPaper-root.MuiMenu-paper': {
      backgroundColor: theme.palette.background.default,
      boxShadow: `-5px 5px ${theme.palette.common.black}`,
      border: mainThemeEnum.border.medium,
    },

    '& > * > * > li': {
      fontSize: theme.typography.fontSize * 1.4,
      fontWeight: theme.typography.fontWeightBold,
    },

    '& > * > * > .Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.background.default,
      borderTop: mainThemeEnum.border.medium,
      borderBottom: mainThemeEnum.border.medium,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        cursor: 'default',
      },
    },
  },
  title: {
    flexGrow: 1,
  },
  toggleGroup: {
    marginRight: theme.spacing(2),
  },
}));

const StyledToggleButton = withStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
    border: 'none',
    color: theme.palette.grey[400],
    '&$selected': {
      backgroundColor: 'rgba(0,0,0,0)',
      color: theme.palette.primary.main,

      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0)',
        cursor: 'default',
      },
      transition: 'boxShadow 0s',
    },
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
    },
  },

  selected: {
    backgroundColor: theme.palette.primary.main,
  },
}))(ToggleButton);

const IframesSummary = ({ lessonIframes, setFormData }) => {
  const classes = useStyles();

  const handleChange = (e) => {
    const current = +e.target.name;
    const newPosition = e.target.value;

    const updatedIframes = lessonIframes.map((item, i) => {
      const parsedHTML = parseHTML(item);
      const { order } = getInfoHTML(item);

      if (current === order) {
        parsedHTML.setAttribute('order', newPosition);
      }

      if (order === newPosition) {
        parsedHTML.setAttribute('order', current);
      }

      return parsedHTML.outerHTML;
    });

    setFormData((formData) => ({
      ...formData,
      lessonIframes: {
        ...formData.lessonIframes,
        value: updatedIframes,
      },
    }));
  };

  const handleToggleOrientation = (current) => {
    const updatedIframes = lessonIframes.map((item) => {
      const parsedHTML = parseHTML(item);
      const { order, orientation } = getInfoHTML(item);

      if (current === order) {
        parsedHTML.setAttribute(
          'orientation',
          orientation === 'landscape' ? 'portrait' : 'landscape'
        );
      }

      return parsedHTML.outerHTML;
    });

    setFormData((formData) => ({
      ...formData,
      lessonIframes: {
        ...formData.lessonIframes,
        value: updatedIframes,
      },
    }));
  };

  const handleDeleteIframe = (e) => {
    const current = +e.target.id;

    const newIframes = lessonIframes.reduce((newArray, item) => {
      const parsedItem = parseHTML(item);
      const { order } = getInfoHTML(item);

      if (order === current) {
        return newArray;
      }

      if (order > current) {
        parsedItem.setAttribute('order', order - 1);
        newArray.push(parsedItem.outerHTML);

        return newArray;
      }

      newArray.push(item);
      return newArray;
    }, []);

    setFormData((formData) => ({
      ...formData,
      lessonIframes: {
        ...formData.lessonIframes,
        value: newIframes,
      },
    }));
  };

  return (
    <>
      {lessonIframes
        .sort((a, b) => {
          const parsedA = parseHTML(a);
          const parsedB = parseHTML(b);

          return (
            +parsedA.getAttribute('order') - +parsedB.getAttribute('order')
          );
        })
        .map((item, i) => {
          const { title, order, orientation } = getInfoHTML(item);

          return (
            <Box key={item + i} className={classes.iframeContainer}>
              <ToggleButtonGroup
                value={orientation}
                exclusive
                name={order.toString()}
                onChange={() => handleToggleOrientation(order)}
                className={classes.toggleGroup}
              >
                <StyledToggleButton
                  value='portrait'
                  // className={classes.toggleButton}
                >
                  <Tooltip title='Display in portrait mode'>
                    <CropPortraitSharpIcon />
                  </Tooltip>
                </StyledToggleButton>
                <StyledToggleButton
                  value='landscape'
                  // className={classes.toggleButton}
                >
                  <Tooltip title='Display in landscape mode'>
                    <CropLandscapeSharpIcon />
                  </Tooltip>
                </StyledToggleButton>
              </ToggleButtonGroup>

              <Select
                labelId='demo-customized-select-label'
                id='demo-customized-select'
                value={order}
                onChange={handleChange}
                name={order.toString()}
                IconComponent={'div'}
                SelectDisplayProps={{
                  className: classes.selectDisplay,
                }}
                MenuProps={{
                  className: classes.selectMenu,
                }}
              >
                {lessonIframes.map((item, i) => (
                  <MenuItem key={'select-item' + item + i} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant={'h6'} className={classes.title}>
                {title}
              </Typography>

              <div id={order} onClick={handleDeleteIframe}>
                <ClearRoundedIcon id={order} className={classes.deleteIcon} />
              </div>
            </Box>
          );
        })}
    </>
  );
};

export default IframesSummary;
