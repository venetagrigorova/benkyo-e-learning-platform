import { Container, Fab, makeStyles, Typography } from '@material-ui/core';
import mainTheme from '../../themes/main.theme';
import mainThemeEnum from '../../themes/main.theme.enum';
import MenuBookSharpIcon from '@material-ui/icons/MenuBookSharp';
import { useContext, useEffect, useState } from 'react';
import CatalogueContext from '../../context/CatalogueContext';
import qs from 'query-string';
import Masonry from 'react-masonry-css';
import CatalogueCourseCard from './CatalogueCourseCard';
import './masonryGridStyling.css';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import ScrollTop from '../ScrollTop/ScrollTop';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useStyles = makeStyles((theme) => ({
  catalogueContainer: {
    marginLeft: mainThemeEnum.sizing.drawerWidth,
    margin: mainTheme.spacing(3),
    padding: mainTheme.spacing(2),
    paddingLeft: mainTheme.spacing(4),
  },
  masonryGrid: {
    display: 'flex',
    marginLeft: -theme.spacing(2),
  },
  masonryGridColumn: {
    marginLeft: theme.spacing(2),
    '& > div': {
      marginBottom: theme.spacing(2),
    },
  },
  scrollTopContainer: {
    background: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: mainTheme.palette.primary.main,
      boxShadow: `-2px 2px 0px -1px ${mainTheme.palette.text.primary}`,
      transform: 'translate(2px, -2px)',
    },
    border: mainThemeEnum.border.medium,
    padding: mainTheme.spacing(1),
    transition: 'boxShadow 0s',
  },
  scrollTopIcon: {
    fontSize: theme.typography.fontSize * 1.5,
  },
  title: {
    userSelect: 'none',
  },
  titleIcon: {
    marginRight: mainTheme.spacing(2),
    marginBottom: mainTheme.spacing(4),
    fontSize: mainTheme.typography.fontSize * 2.8,
  },
  titleContainer: {
    display: 'flex',
  },
}));

const CatalogueCourses = () => {
  const classes = useStyles();
  const { catalogueState, setCatalogueState } = useContext(CatalogueContext);
  const [displayedCourses, setDisplayedCourses] = useState(10);

  const increaseCourses = () => {
    setDisplayedCourses((prev) => prev + 10);
  };

  // Infinite scroll
  useBottomScrollListener(increaseCourses);

  // Upon mounting, parses URL to activate categories and search by looking up the URL for them.

  // CATEGORIES:          can either be a string or an array.
  // SEARCH:              a string

  useEffect(() => {
    const queryParsed = qs.parse(window.location.search);

    // Categories
    if (queryParsed.categories) {
      setCatalogueState({
        ...catalogueState,
        activeTopics:
          typeof queryParsed.categories === 'string'
            ? [
                {
                  topicId: catalogueState.topics.filter(
                    (item) =>
                      item.topicName.toLowerCase() ===
                      queryParsed.categories.toLowerCase()
                  )[0].topicId,
                  topicName: queryParsed.categories,
                },
              ]
            : queryParsed.categories.map((topicName) => ({
                topicId: catalogueState.topics.filter(
                  (item) =>
                    item.topicName.toLowerCase() === topicName.toLowerCase()
                )[0].topicId,
                topicName: catalogueState.topics.filter(
                  (item) =>
                    item.topicName.toLowerCase() === topicName.toLowerCase()
                )[0].topicName,
              })),
      });
    }

    if (queryParsed.search) {
      setCatalogueState({
        ...catalogueState,
        search: queryParsed.search,
      });
    }

    document.title =
      (catalogueState.search !== ''
        ? 'Search'
        : !!catalogueState.activeTopics.length
        ? 'Categories'
        : 'Catalogue') + ' | Benkyō';
  }, []);

  const renderTitle = () =>
    catalogueState.search !== ''
      ? "This is what we've got for you:"
      : !!catalogueState.activeTopics.length
      ? 'Browse our carefully designed courses'
      : 'Browse our carefully designed courses';

  // Determines which courses to display based on the presence or not of
  // a search term in the Catalogue context.

  // searchResult:              - Result of the LUNR indexed search (too exclusive).
  // searchResultExtended:      - Adds the courses of which either the title
  //                              or description match the search term.
  // filteredByTopics:          - If topics are selected, filters the search results.
  //                              If no search results, renders the courses matching
  //                              the topics.

  const renderCourses = (count) => {
    const searchResult =
      catalogueState.search !== ''
        ? catalogueState.index
            .search(catalogueState.search)
            .map((res) =>
              catalogueState.courses.find(
                (course) => course.courseId === +res.ref
              )
            )
        : catalogueState.courses;

    const searchResultExtended = catalogueState.search
      ? searchResult.concat(
          catalogueState.courses.filter(
            (item) =>
              (item.courseTitle
                .substring(0)
                .toLowerCase()
                .includes(catalogueState.search.toLowerCase()) ||
                item.courseDescription
                  .substring(0)
                  .toLowerCase()
                  .includes(catalogueState.search.toLowerCase())) &&
              searchResult.every(
                (searchResult) => searchResult.courseId !== item.courseId
              )
          )
        )
      : catalogueState.courses;

    const filteredByTopics =
      catalogueState.activeTopics.length > 0
        ? searchResultExtended
            .filter((i) => {
              return !!i.courseTopics;
            })
            .filter((course) => {
              return catalogueState.activeTopics.reduce((acc, topic) => {
                const str = topic.topicName.toLowerCase();

                return (
                  course.courseTopics.some(
                    (item) => item.topicName.toLowerCase() === str
                  ) && acc
                );
              }, true);
            })
        : searchResultExtended;
    return filteredByTopics.slice(0, count) || searchResult;
  };

  return (
    <>
      <Container className={classes.catalogueContainer}>
        <div id='top-anchor' />
        <div className={classes.titleContainer}>
          <MenuBookSharpIcon className={classes.titleIcon} />
          <Typography variant={'h4'} className={classes.title}>
            {renderTitle(displayedCourses)}
          </Typography>
        </div>
        <Masonry
          breakpointCols={2}
          className={classes.masonryGrid}
          columnClassName={classes.masonryGridColumn}
        >
          {renderCourses(displayedCourses).map((course) => (
            <CatalogueCourseCard
              key={course.courseId + course.courseTitle}
              course={course}
            />
          ))}
        </Masonry>
        <ScrollTop>
          <Fab
            size='medium'
            className={classes.scrollTopContainer}
            aria-label='scroll back to top'
          >
            <KeyboardArrowUpIcon className={classes.scrollTopIcon} />
          </Fab>
        </ScrollTop>
      </Container>
    </>
  );
};

export default CatalogueCourses;
