import {
  makeStyles,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  Popper,
  Box,
} from '@material-ui/core';
import validator from 'validator';
import { useState } from 'react';
import allLocalesValidator from '../../../common/allLocalesValidator';
import fields from '../../../common/fields.enum';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import SubmitButton from '../../SubmitButton/SubmitButton';
import { BASE_URL } from '../../../common/strings.enums';
import userConnectStyles from './styles/userConnectStyles';

const useStyles = makeStyles(userConnectStyles.inputFormStyling);

const Register = ({ setErrorData, setErrorSubmit, setSuccessSubmit }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFetching, setFetching] = useState(false);
  const [formData, setFormData] = useState({
    email: {
      name: 'email',
      value: '',
      isValid: true,
      validator: (value) => validator.isEmail(value),
    },
    password: {
      name: 'password',
      value: '',
      isValid: true,
      validator: (value) =>
        validator.isStrongPassword(value, {
          minLength: 8,
          minLowerCase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          returnScore: false,
        }),
    },
    firstName: {
      name: 'firstName',
      value: '',
      isValid: true,
      validator: (value) => allLocalesValidator(value),
    },
    lastName: {
      name: 'lastName',
      value: '',
      isValid: true,
      validator: (value) => allLocalesValidator(value),
    },
    birthdate: {
      name: 'birthdate',
      value: '',
    },
  });

  const handleChangeFormField = (e) => {
    const target = e.target;
    setErrorSubmit(false);

    if (target.name === fields.birthday) {
      setFormData({
        ...formData,
        birthdate: {
          ...formData.birthdate,
          value: target.value,
        },
      });
      return;
    }

    const fieldObject = formData[target.name];

    setFormData({
      ...formData,
      [target.name]: {
        ...fieldObject,
        value: target.value,
        isValid: fieldObject.validator(target.value),
      },
    });
  };

  // Disables inner borders input fields
  const inputProp = {
    classes: { notchedOutline: classes.noBorder },
  };

  // Popper handler
  const handleClickPasswordInfo = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  // Creates input properties & info button for password field
  const passwordProp = {
    ...inputProp,
    endAdornment: (
      <div>
        <InputAdornment>
          <InfoOutlinedIcon
            type='button'
            aria-describedby={id}
            onClick={handleClickPasswordInfo}
          />
        </InputAdornment>
        <Popper
          id={id}
          open={open}
          anchorEl={anchorEl}
          className={classes.passwordInfo}
          placement={'right'}
        >
          <Typography>
            Your password should include:
            <ul>
              <li>1 lowercase character</li>
              <li>1 uppercase character</li>
              <li>1 digit</li>
              <li>1 special character</li>
            </ul>
          </Typography>
        </Popper>
      </div>
    ),
  };

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    setFetching(true);

    fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email.value,
        password: formData.password.value,
        firstName: formData.firstName.value,
        lastName: formData.lastName.value,
        birthdate: formData.birthdate.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          setFormData({
            ...formData,
            email: {
              ...formData.email,
              isValid: false,
            },
            password: {
              ...formData.password,
              isValid: false,
            },
            firstName: {
              ...formData.firstName,
              isValid: false,
            },
            lastName: {
              ...formData.lastName,
              isValid: false,
            },
          });
          setErrorData(res);
          setErrorSubmit(true);
          setFetching(false);
          return;
        }

        setFetching(false);
        setErrorSubmit(false);
        setSuccessSubmit(true);
      })
      .catch((err) => {});
  };

  return (
    <>
      <Typography variant='h5' className={classes.formTitle}>
        Join the Benkyō community
      </Typography>
      <form autoComplete='off' onSubmit={handleSubmitRegistration}>
        <Grid container spacing={2} className={classes.registrationForm}>
          <Grid item sm={12}>
            <Typography>Email</Typography>
            <TextField
              required
              variant='outlined'
              name={fields.email}
              value={formData.email.value}
              className={classes.formInput}
              fullWidth
              onChange={handleChangeFormField}
              InputProps={inputProp}
              error={!formData.email.isValid}
            />
          </Grid>
          <Grid item sm={12}>
            <Typography>Password</Typography>
            <TextField
              required
              name={fields.password}
              className={`${classes.passwordInput} ${classes.formInput}`}
              type='password'
              variant='outlined'
              fullWidth
              onChange={handleChangeFormField}
              InputProps={passwordProp}
              error={!formData.password.isValid}
            />
          </Grid>
          <Grid item sm={5}>
            <Typography>First name</Typography>
            <TextField
              required
              variant='outlined'
              name={fields.firstName}
              className={classes.formInput}
              fullWidth
              onChange={handleChangeFormField}
              InputProps={inputProp}
              error={!formData.firstName.isValid}
            />
          </Grid>
          <Grid item sm={7}>
            <Typography>Last name</Typography>
            <TextField
              required
              variant='outlined'
              name={fields.lastName}
              className={classes.formInput}
              fullWidth
              onChange={handleChangeFormField}
              InputProps={inputProp}
              error={!formData.lastName.isValid}
            />
          </Grid>
          <Grid item sm={12}>
            <Typography>Birthdate</Typography>
            <TextField
              required
              type='date'
              variant='outlined'
              name='birthdate'
              className={classes.formInput}
              fullWidth
              onChange={handleChangeFormField}
              InputProps={inputProp}
            />
          </Grid>
        </Grid>
        <Box className={classes.submitButton}>
          <SubmitButton
            placeholder='sign up'
            isFetching={isFetching}
            disableIf={
              formData.email.value === '' ||
              formData.password.value === '' ||
              formData.firstName.value === '' ||
              formData.lastName.value === '' ||
              !formData.email.isValid ||
              !formData.password.isValid ||
              !formData.firstName.isValid ||
              !formData.lastName.isValid ||
              !formData.birthdate.value ||
              isFetching
            }
          />
        </Box>
      </form>
    </>
  );
};

export default Register;
