import { Container, Fab, makeStyles, Typography } from "@material-ui/core";
import mainTheme from "../../themes/main.theme";
import mainThemeEnum from "../../themes/main.theme.enum";
import MenuBookSharpIcon from "@material-ui/icons/MenuBookSharp";
import Masonry from "react-masonry-css";
import CatalogueCourseCard from "../CatalogueCourses/CatalogueCourseCard";
import "./masonryGridStyling.css";
import ScrollTop from "../ScrollTop/ScrollTop";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles((theme) => ({
  coursesGrid: {},
  catalogueContainer: {
    // marginLeft: mainThemeEnum.sizing.drawerWidth,
    margin: mainTheme.spacing(3),
    padding: mainTheme.spacing(2),
  },
  masonryGrid: {
    display: "flex",
    marginLeft: -theme.spacing(2),
  },
  masonryGridColumn: {
    marginLeft: theme.spacing(2),
    "& > div": {
      marginBottom: theme.spacing(2),
    },
  },
  scrollTopContainer: {
    background: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: mainTheme.palette.primary.main,
      boxShadow: `-2px 2px 0px -1px ${mainTheme.palette.text.primary}`,
      transform: "translate(2px, -2px)",
    },
    border: mainThemeEnum.border.medium,
    padding: mainTheme.spacing(1),
    transition: "boxShadow 0s",
  },
  scrollTopIcon: {
    fontSize: theme.typography.fontSize * 1.5,
  },
  title: {
    userSelect: "none",
  },
  titleIcon: {
    marginRight: mainTheme.spacing(2),
    marginBottom: mainTheme.spacing(4),
    fontSize: mainTheme.typography.fontSize * 2.8,
  },
  titleContainer: {
    display: "flex",
    marginBottom: "20px",
  },
}));

const MyCoursesContent = ({ myCourses }) => {
  const classes = useStyles();

  const renderTitle = () =>
    myCourses.length === 0
      ? "You're not enrolled in any courses yet!"
      : "Here are the courses you are enrolled in...";

  return (
    <>
      <Container className={classes.catalogueContainer}>
        <div id="top-anchor" />
        <div className={classes.titleContainer}>
          <MenuBookSharpIcon className={classes.titleIcon} />
          <Typography variant={"h4"} className={classes.title}>
            {renderTitle(myCourses)}
          </Typography>
        </div>
        <Masonry
          breakpointCols={2}
          className={classes.masonryGrid}
          columnClassName={classes.masonryGridColumn}
        >
          {myCourses.map((course) => (
            <CatalogueCourseCard
              key={course.courseId + course.courseTitle}
              course={course}
            />
          ))}
        </Masonry>
        <ScrollTop>
          <Fab
            size="medium"
            className={classes.scrollTopContainer}
            aria-label="scroll back to top"
          >
            <KeyboardArrowUpIcon className={classes.scrollTopIcon} />
          </Fab>
        </ScrollTop>
      </Container>
    </>
  );
};

export default MyCoursesContent;
