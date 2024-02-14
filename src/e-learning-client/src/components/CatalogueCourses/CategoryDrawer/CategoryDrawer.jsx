import {
  Button,
  Drawer,
  makeStyles,
  MenuItem,
  MenuList,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { useContext, useEffect } from 'react';
import CatalogueContext from '../../../context/CatalogueContext';
import mainTheme from '../../../themes/main.theme';
import mainThemeEnum from '../../../themes/main.theme.enum';
import qs from 'query-string';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles({
  categoriesContainer: {
    width: mainThemeEnum.sizing.drawerWidth,

    border: mainThemeEnum.border.bold,
    marginLeft: mainTheme.spacing(2),
    marginTop: '-5px',
    marginBottom: mainTheme.spacing(2),
    padding: '0px',
    paddingBottom: '-2px',
    background: mainTheme.palette.background.default,
    msOverflowStyle: 'none' /* IE and Edge */,
    scrollbarWidth: 'none' /* Firefox */,
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  drawer: {
    display: 'flex',
    justifyContent: 'center',
    overflow: 'ellipsis',
  },
  drawerButton: {
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
  drawerToolbar: {
    minHeight: mainThemeEnum.marginNavbar(),
  },
  listItem: {
    padding: '0',
    selected: {
      backgroundColor: mainTheme.palette.background.paper,
    },
  },
  paper: {
    background: mainTheme.palette.background.default,
    border: 'none',
    msOverflowStyle: 'none' /* IE and Edge */,
    scrollbarWidth: 'none' /* Firefox */,
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

const CategoryDrawer = () => {
  const { catalogueState, setCatalogueState } = useContext(CatalogueContext);
  const classes = useStyles();
  const location = useLocation();
  const topics = catalogueState.topics.sort((a, b) =>
    a.topicName.localeCompare(b.topicName, 'en', { sensitivity: 'base' })
  );
  const activeTopics = catalogueState.activeTopics;
  const isActiveTopic = (topicName) => {
    return !!activeTopics.filter((item) => {
      return item.topicName.toLowerCase() === topicName.toLowerCase();
    })[0];
  };

  useEffect(() => {
    const activeTopics = qs.parse(window.location.search);
  }, []);

  const handleCategoryButton = (e) => {
    e.preventDefault();
    const clickedTag = e.target.innerText.toLowerCase();

    // If clicking on active topic

    if (isActiveTopic(clickedTag)) {
      setCatalogueState({
        ...catalogueState,
        activeTopics: [
          ...catalogueState.activeTopics.filter(
            (item) => item.topicName.toLowerCase() !== clickedTag
          ),
        ],
      });

      const parsedQuery = qs.parse(location.search);

      if (catalogueState.activeTopics.length === 1) {
        parsedQuery.categories = [];
      } else {
        const arrayCat = catalogueState.activeTopics.map(
          (item) => item.topicName
        );
        parsedQuery.categories = arrayCat.filter((i) => i !== clickedTag);
      }
      window.history.replaceState(
        null,
        '',
        'catalogue?' + qs.stringify(parsedQuery)
      );

      return;
    }

    const parsedQuery = qs.parse(location.search);

    if (!catalogueState.activeTopics.length) {
      parsedQuery.categories = [clickedTag];
    } else {
      const arrayCat = catalogueState.activeTopics.map(
        (item) => item.topicName
      );
      arrayCat.push(clickedTag);
      parsedQuery.categories = arrayCat;
    }

    window.history.replaceState(
      null,
      '',
      'catalogue?' + qs.stringify(parsedQuery)
    );

    const newActiveTopics = [
      ...catalogueState.activeTopics,
      catalogueState.topics.filter(
        (item) => item.topicName.toLowerCase() === clickedTag
      )[0],
    ].sort((a, b) =>
      a.topicName.localeCompare(b.topicName, 'en', { sensitivity: 'base' })
    );

    setCatalogueState({
      ...catalogueState,
      activeTopics: newActiveTopics,
    });
  };

  return (
    <Drawer
      className={classes.drawer}
      classes={{ paper: classes.paper }}
      variant='permanent'
    >
      <Toolbar className={classes.drawerToolbar} />
      <MenuList className={classes.categoriesContainer}>
        {topics.map((topic) => {
          return (
            <MenuItem
              key={topic.topicName}
              className={classes.listItem}
              datacatid={topic.topicId}
              selected={isActiveTopic(topic.topicName)}
              classes={{ selected: classes.listItem }}
            >
              <Button
                className={classes.drawerButton}
                datacatid={topic.topicId}
                onClick={handleCategoryButton}
              >
                <Typography variant={'body'} datacatid={topic.topicId}>
                  {topic.topicName}
                </Typography>
              </Button>
            </MenuItem>
          );
        })}
      </MenuList>
    </Drawer>
  );
};

export default CategoryDrawer;
