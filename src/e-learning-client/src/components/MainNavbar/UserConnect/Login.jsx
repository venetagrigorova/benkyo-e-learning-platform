import {
  makeStyles,
  TextField,
  Typography,
  Grid,
  Box,
} from '@material-ui/core';
import validator from 'validator';
import { useContext, useState } from 'react';
import fields from '../../../common/fields.enum';
import { BASE_URL } from '../../../common/strings.enums';
import SubmitButton from '../../SubmitButton/SubmitButton';
import userConnectStyles from './styles/userConnectStyles';
import AuthContext from '../../../context/AuthContext';
import { getDecodedToken } from '../../../utils/token.utils';

const useStyles = makeStyles(userConnectStyles.inputFormStyling);

const Login = ({ setErrorData, setErrorSubmit, setSuccessSubmit }) => {
  const classes = useStyles();
  const { setAccountState } = useContext(AuthContext);
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
    },
  });

  const inputProp = {
    classes: { notchedOutline: classes.noBorder },
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    setFetching(true);

    fetch(`${BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email.value,
        password: formData.password.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode) {
          setFormData({
            email: {
              ...formData.email,
              isValid: false,
            },
            password: {
              ...formData.password,
              isValid: false,
            },
          });
          setErrorData(res);
          setErrorSubmit(true);
          setFetching(false);
          return;
        }
        localStorage.setItem('token', res.data);
        setAccountState(getDecodedToken(res.data));
        setFetching(false);
        setErrorSubmit(false);
        setSuccessSubmit(true);
      })
      .catch((err) => {});
  };

  const handleChangeEmail = (e) => {
    setFormData({
      ...formData,
      email: {
        ...formData.email,
        isValid: formData.email.validator(e.target.value),
        value: e.target.value,
      },
    });
  };

  const handleChangePassword = (e) => {
    setFormData({
      ...formData,
      password: {
        name: 'password',
        value: e.target.value,
        isValid: true,
      },
    });
  };

  return (
    <>
      <Typography variant='h5' className={classes.formTitle}>
        Join the Benkyō community
      </Typography>
      <form autoComplete='off' onSubmit={handleSubmitLogin}>
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
              onChange={handleChangeEmail}
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
              onChange={handleChangePassword}
              InputProps={inputProp}
              error={!formData.password.isValid}
            />
          </Grid>
        </Grid>

        <Box className={classes.submitButton}>
          <SubmitButton
            placeholder='login'
            isFetching={isFetching}
            disableIf={
              !formData.email.isValid ||
              formData.password.value === '' ||
              isFetching
            }
          />
        </Box>
      </form>
    </>
  );
};

export default Login;
