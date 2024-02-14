import { Box, Chip, makeStyles } from '@material-ui/core';
import mainThemeEnum from '../../../themes/main.theme.enum';

const useStyles = makeStyles((theme) => ({
  chip: {
    backgroundColor: 'rgba(0,0,0,0)',
    marginRight: theme.spacing(2),
    '& > *': {
      borderBottom: mainThemeEnum.borderGreen.thin,
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
    },
    userSelect: 'none',
  },
  chipsBox: {
    cursor: 'default',
  },
}));

const CategoryChips = ({ courseTopics }) => {
  const classes = useStyles();

  return (
    <Box className={classes.chipsBox}>
      {!!courseTopics &&
        courseTopics.map((i) => (
          <Chip
            key={i.topicName}
            label={i.topicName}
            className={classes.chip}
            size='medium'
          />
        ))}
    </Box>
  );
};
export default CategoryChips;
