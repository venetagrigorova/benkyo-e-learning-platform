import { Box, makeStyles, Paper } from '@material-ui/core';
import { useState } from 'react';
import mainThemeEnum from '../../../../../themes/main.theme.enum';
import SwipeableViews from 'react-swipeable-views';
import EditorTab from './EditorTab';
import PreviewTab from './PreviewTab';
import TabBar from '../Utils/TabBar';

const useStyles = makeStyles((theme) => ({
  Editor: {
    backgroundColor: theme.palette.background.default,
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

const Editor = ({ lessonBody, setFormData }) => {
  const [value, setValue] = useState(0);
  const classes = useStyles();

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <>
      <Paper className={classes.Editor} elevation={0} component={Box}>
        <div className={classes.tabBarContainer}>
          <TabBar value={value} setValue={setValue} placeholder={'Editor'} />
        </div>
        <SwipeableViews
          index={value}
          onChangeIndex={handleChangeIndex}
          className={classes.swipeableViews}
        >
          <EditorTab lessonBody={lessonBody} setFormData={setFormData} />
          <PreviewTab lessonBody={lessonBody.value} />
        </SwipeableViews>
      </Paper>
    </>
  );
};
export default Editor;
