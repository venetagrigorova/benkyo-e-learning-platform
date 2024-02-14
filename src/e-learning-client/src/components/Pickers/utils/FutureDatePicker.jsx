import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  datePicker: {
    '& > *': {
      color: theme.palette.text.secondary,
      '&::before': {
        border: 'none',
      },
      '& > *  ': {
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
      },
    },
  },
}));
const DatePicker = ({ clearable, selectedDate, handleDateChange, props }) => {
  const classes = useStyles();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DateTimePicker
        className={classes.datePicker}
        clearable={clearable}
        autoOk
        hideTabs
        ampm={false}
        format='MMM do yyyy, HH:mm'
        value={moment(selectedDate).isBefore() ? null : selectedDate}
        maxDate={new Date('2038-12-31')}
        placeholder={
          !selectedDate || moment(selectedDate).isBefore() ? 'Pick a date' : ''
        }
        onAccept={handleDateChange}
        onChange={() => {}}
        allowKeyboardControl={false}
        leftArrowButtonProps={{ 'aria-label': 'Prev month' }}
        rightArrowButtonProps={{ 'aria-label': 'Next month' }}
        {...props}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePicker;
