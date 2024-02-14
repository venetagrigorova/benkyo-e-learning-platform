import { Box, InputBase, makeStyles, Typography } from '@material-ui/core';
import fields from '../../../../../common/fields.enum';

const useStyles = makeStyles((theme) => ({
  formInput: {
    marginLeft: theme.spacing(0.8),
    fontSize: theme.typography.fontSize * 2.6,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.primary.main,
  },
  root: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const LessonOrderCreate = ({ formData, handleChangeOrderField }) => {
  const classes = useStyles();

  // Disables inner borders input fields
  const inputProp = {
    classes: { notchedOutline: classes.noBorder },
  };

  return (
    <>
      <Box className={classes.root}>
        <Typography variant={'h4'}>Lesson nº</Typography>

        <InputBase
          required
          name={fields.lessonOrder}
          value={formData.lessonOrder.value}
          className={classes.formInput}
          placeholder={'?'}
          onChange={handleChangeOrderField}
          InputProps={inputProp}
          error={!formData.lessonOrder.isValid}
          wrapEnabled
        />
      </Box>
    </>
  );
};

export default LessonOrderCreate;
