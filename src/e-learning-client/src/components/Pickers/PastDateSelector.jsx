import { makeStyles, Typography } from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';
import AlignedTextIcon from '../MicroComponents/AlignedTextIcon';
import PastDatePicker from './utils/PastDatePicker';

const useStyles = makeStyles((theme) => ({
  datePicker: {
    color: theme.palette.text.secondary,
  },
  text: {
    fontSize: theme.typography.fontSize * 1.3,
    marginRight: theme.spacing(1),
  },
  largeText: {
    fontSize: theme.typography.fontSize * 3,
  },
}));

const PastDateSelector = ({
  selectedDate,
  handleDateChange,
  large,
}) => {
  const classes = useStyles();

  return (
    <>
      <AlignedTextIcon>
        <EventIcon />

        <Typography
          color='textSecondary'
          className={`${classes.text} ${large ? classes.largeText : ''}`}
        >
        </Typography>
        <PastDatePicker
          className={classes.datePicker}
          clearable={true}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          props={{ disableFuture: true }}
        />
      </AlignedTextIcon>
    </>
  );
};

export default PastDateSelector;

