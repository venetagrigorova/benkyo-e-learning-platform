import { AppBar, makeStyles, Tab, Tabs } from '@material-ui/core';
import mainThemeEnum from '../../../../../themes/main.theme.enum';

const useStyles = makeStyles((theme) => ({
  tabBar: {
    // borderBottom: mainThemeEnum.border.bold,
    backgroundColor: theme.palette.background.default,
  },
  tabIndicator: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
  tabText: {
    fontSize: theme.typography.fontSize * 1.5,
    color: theme.palette.common.black,
  },
  tabRoot: {
    margin: theme.spacing(3),
    border: mainThemeEnum.borderPlaceholder.bold,
  },
  tabSelected: {
    backgroundColor: theme.palette.primary.main,
    border: mainThemeEnum.border.bold,
  },
}));

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const TabBar = ({ value, setValue, placeholder }) => {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const classes = useStyles();

  return (
    <AppBar
      position='static'
      className={classes.tabBar}
      elevation={0}
      id={'create-lesson-tabs'}
    >
      <Tabs
        classes={{
          indicator: classes.tabIndicator,
          wrapper: classes.textTab,
        }}
        value={value}
        onChange={handleChange}
        variant='fullWidth'
        aria-label='full width tabs example'
      >
        <Tab
          classes={{
            root: classes.tabRoot,
            selected: classes.tabSelected,
            wrapper: classes.tabText,
          }}
          label={placeholder}
          {...a11yProps(0)}
        />
        <Tab
          classes={{
            root: classes.tabRoot,
            selected: classes.tabSelected,
            wrapper: classes.tabText,
          }}
          label='Preview'
          {...a11yProps(1)}
        />
      </Tabs>
    </AppBar>
  );
};

export default TabBar;
