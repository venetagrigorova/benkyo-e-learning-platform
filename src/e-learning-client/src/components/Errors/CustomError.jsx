import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import mainThemeEnum from "../../themes/main.theme.enum";
import ErrorIcon from "@material-ui/icons/Error";
const useStyles = makeStyles((theme) => ({
  errorContainer: {
    width: "50%",
    height: "50%",
    overflow: "auto",
    margin: "auto",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: mainThemeEnum.border.bold,
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(2),
      width: "auto",
      height: "auto",
    },
  },
  errorContent: {
    padding: "10%",
  },
  errorText: {
    color: theme.palette.error.main,
    marginLeft: theme.spacing(2),
  },
  errorHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
    color: theme.palette.text.secondary,
    flexShrink: 1,
    flexWrap: "wrap",
    textTransform: "uppercase",
    "& > svg": {
      color: theme.palette.error.main,
      fontSize: theme.typography.fontSize * 2,
    },
  },
}));

const CustomError = ({ errorMessage }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.errorContainer} elevation={0}>
      <Box className={classes.errorContent}>
        <div className={classes.errorHeader}>
          <ErrorIcon />
          <Typography
            variant="h3"
            className={classes.errorText}
            align="center"
            paragraph
            textTransform="uppercase"
          >
            Error
          </Typography>
        </div>

        <Typography variant="h6" className={classes.errorText} paragraph>
          <br />
          {errorMessage}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CustomError;
