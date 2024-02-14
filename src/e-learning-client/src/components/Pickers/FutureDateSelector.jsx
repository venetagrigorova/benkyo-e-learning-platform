import { makeStyles, Typography } from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';
import moment from 'moment';
import AlignedTextIcon from '../MicroComponents/AlignedTextIcon';
import DatePicker from './utils/FutureDatePicker';

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

const FutureDateTimeSelector = ({
  dateRestriction,
  handleDateChange,
  lesson,
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
          {!dateRestriction || moment(dateRestriction).isBefore()
            ? lesson
              ? 'Not scheduled'
              : 'No restrictions'
            : lesson
            ? 'Scheduled for'
            : 'Available from \n'}
        </Typography>
        <DatePicker
          className={classes.datePicker}
          clearable={true}
          selectedDate={dateRestriction}
          handleDateChange={handleDateChange}
          props={{ disablePast: true }}
        />
      </AlignedTextIcon>
    </>
  );
};

export default FutureDateTimeSelector;
