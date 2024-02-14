import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
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
const PastDatePicker = ({ clearable, selectedDate, handleDateChange, props }) => {
  const classes = useStyles();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        className={classes.datePicker}
        clearable={clearable}
        autoOk
        hideTabs
        ampm={false}
        format='MMM do yyyy'
        value={moment(selectedDate).isAfter() ? null : selectedDate}
        maxDate={new Date()}
        placeholder={
          !selectedDate ? 'Pick a date' : ''
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

export default PastDatePicker;
