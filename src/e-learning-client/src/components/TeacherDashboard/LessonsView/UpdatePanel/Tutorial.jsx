import { Grid, makeStyles, Typography } from '@material-ui/core';
import mainThemeEnum from '../../../../themes/main.theme.enum';

const useStyles = makeStyles((theme) => ({
  tutorialParagraph: {
    borderLeft: mainThemeEnum.borderGreen.medium,
    paddingLeft: theme.spacing(1),
  },
}));

const Tutorial = () => {
  const classes = useStyles();
  return (
    <Grid item xs={12} md={6}>
      <Typography
        className={classes.tutorialParagraph}
        paragraph
        align='justify'
      >
        Hi there! To create a lesson, we first need a title, a description and
        the order of the lesson in its section. You can also schedule a date
        that will show in your students' calendar.
      </Typography>

      <Typography
        className={classes.tutorialParagraph}
        variant={'h6'}
        paragraph
        align='justify'
      >
        Content of the lesson
      </Typography>

      <Typography
        className={classes.tutorialParagraph}
        paragraph
        align='justify'
      >
        Below, you can type the content of your lesson in either HTML or
        Markdown syntax (which is ok if you just want to type regular text).
      </Typography>

      <Typography
        className={classes.tutorialParagraph}
        paragraph
        align='justify'
      >
        We also give you the possibility to add as many IFrames as
        you&nbsp;want&nbsp;:)
      </Typography>

      <Typography
        className={classes.tutorialParagraph}
        paragraph
        align='justify'
      >
        Have fun!
      </Typography>
    </Grid>
  );
};

export default Tutorial;
