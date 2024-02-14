import { makeStyles, withStyles } from "@material-ui/core/styles";
import { LinearProgress, Typography, Box } from "@material-ui/core";
import mainTheme from "../../themes/main.theme";
import { useContext } from "react";
import CourseContext from "../../context/CourseContext";

const useStyles = makeStyles((theme) => ({
  percentage: {
    textAlign: "center",
  },
}));
const BorderLinearProgress = withStyles(() => ({
  root: {
    height: 15,
  },
  colorPrimary: {
    backgroundColor: mainTheme.palette.primary.light,
  },
  bar: {
    backgroundColor: mainTheme.palette.primary.main,
  },
}))(LinearProgress);

const ProgressBar = () => {
  const classes = useStyles();
  const { courseState } = useContext(CourseContext);
  const courseProgress = courseState.courseProgress;

  let totalLessons = 0;
  for (const section in courseState.lessons) {
    totalLessons += Object.keys(courseState.lessons[section]).length;
  }

  const courseProgressValue =
    totalLessons === 0
      ? 0
      : Math.round((courseProgress.completeLessons / totalLessons) * 100);

  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <BorderLinearProgress
          className={classes.progressBar}
          variant="determinate"
          value={courseProgressValue}
        ></BorderLinearProgress>
      </Box>
      <Box className={classes.percentage} minWidth={35}>
        <Typography variant={"body2"}>{`${courseProgressValue} %`}</Typography>
      </Box>
    </Box>
  );
};

export default ProgressBar;
