import { Box, makeStyles, Paper } from '@material-ui/core';
import { useState } from 'react';
import mainThemeEnum from '../../../../../themes/main.theme.enum';
import SwipeableViews from 'react-swipeable-views';
import EnrollModalTabBar from '../Utils/TabBar';
import PreviewTab from './PreviewTab';
import IFramesTab from './IFramesTab';
import TabBar from '../Utils/TabBar';

const useStyles = makeStyles((theme) => ({
  iFramesManager: {
    backgroundColor: theme.palette.background.default,
    // width: '100%',
    overflow: 'scroll',
    border: mainThemeEnum.border.bold,
    borderLeft: '0',
    borderRight: '0',
    maxHeight: '800px',
    scrollbarWidth: 'none' /* Firefox */,
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  swipeableViews: {
    padding: 0,
  },
}));

const IFramesManager = ({ lessonIframes, setFormData }) => {
  const [value, setValue] = useState(0);
  const [mode, setMode] = useState('markdown');
  const classes = useStyles();

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleModeToggle = (e) => {
    setMode(mode === 'html' ? 'markdown' : 'html');
  };

  return (
    <>
      <Paper className={classes.iFramesManager} elevation={0} component={Box}>
        <>
          <TabBar value={value} setValue={setValue} placeholder={'IFrames'} />
          <SwipeableViews
            index={value}
            onChangeIndex={handleChangeIndex}
            className={classes.swipeableViews}
          >
            <IFramesTab
              lessonIframes={lessonIframes}
              setFormData={setFormData}
            />
            <PreviewTab
              lessonIframes={lessonIframes}
              mode={mode}
              setFormData={setFormData}
            />
          </SwipeableViews>
        </>
      </Paper>
    </>
  );
};
export default IFramesManager;
