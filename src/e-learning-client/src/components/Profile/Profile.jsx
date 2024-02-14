import {
  makeStyles,
  Typography,
  Box,
  TextField,
  Fade,
} from '@material-ui/core';
import { useContext, useState } from 'react';
import mainTheme from '../../themes/main.theme';
import mainThemeEnum from '../../themes/main.theme.enum';
import AlignedTextIcon from '../MicroComponents/AlignedTextIcon';
import EmailIcon from '@material-ui/icons/Email';
import CakeIcon from '@material-ui/icons/Cake';
import EventIcon from '@material-ui/icons/Event';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import CloseIcon from '@material-ui/icons/Close';
import UserContext from '../../context/UserContext';
import moment from 'moment';
import fields from '../../common/fields.enum';
import validator from 'validator';
import SubmitButton from '../SubmitButton/SubmitButton';
import { editUser } from '../../requests/userRequests';
import PastDateSelector from '../Pickers/PastDateSelector';

const useStyles = makeStyles((theme) => ({
  profileContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    backgroundColor: mainTheme.palette.primary.main,
    borderBottom: mainThemeEnum.border.bold,
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  userDetailsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20px',
    paddingBottom: '20px',
  },
  profileDetails: {
    width: '600px',
  },
  userGreeting: {
    fontWeight: mainTheme.typography.fontWeightMedium,
    textAlign: 'center',
  },
  fullName: {
    textTransform: 'uppercase',
    fontWeight: mainTheme.typography.fontWeightMedium,
    color: mainTheme.palette.secondary.main,
  },
  userDetails: {
    paddingTop: '20px',
  },
  userDetail: {
    paddingTop: '20px',
  },
  detailField: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  detailFieldName: {
    textTransform: 'uppercase',
    fontWeight: mainTheme.typography.fontWeightMedium,
  },
  formInput: {
    paddingRight: '10px',
  },
  editIcon: {
    color: mainTheme.palette.primary.main,
  },
  submitButton: {
    marginTop: '30px',
    display:"flex",
    justifyContent:"flex-end"
  }
}));

const ProfileContent = () => {
  const classes = useStyles();
  // const { accountState } = useContext(AuthContext);
  const { userState, setUserState } = useContext(UserContext);
  const [editing, setEditing] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [, setErrorSubmit] = useState(false);
  const [, setErrorData] = useState({});

  const [formData, setFormData] = useState({
    firstname: {
      name: 'firstname',
      value: userState.firstName,
      isValid: true,
      validator: (value) => validator.isLength(value, { min: 3, max: 30 }),
    },
    lastname: {
      name: 'lastname',
      value: userState.lastName,
      isValid: true,
      validator: (value) => validator.isLength(value, { min: 3, max: 30 }),
    },
    email: {
      name: 'email',
      value: userState.email,
      isValid: true,
      validator: (value) => validator.isEmail(value),
    },
    birthday: {
      name: 'birthday',
      value: userState.birthdate,
      isValid: true,
      validator: (value) => validator.isDate(value),
    },
  });

  const handleChangeFirstName = (e) => {
    setFormData({
      ...formData,
      firstname: {
        ...formData.firstname,
        isValid: formData.firstname.validator(e.target.value),
        value: e.target.value,
      },
    });
  };

  const handleChangeLastName = (e) => {
    setFormData({
      ...formData,
      lastname: {
        ...formData.lastname,
        isValid: formData.lastname.validator(e.target.value),
        value: e.target.value,
      },
    });
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

  const handleChangeBirthday = (e) => {
    setFormData({
      ...formData,
      birthday: {
        ...formData.birthday,
        value: e === null ? e : e.toISOString(),
      },
    });
  };

  // Disables inner borders input fields
  const inputProp = {
    classes: { notchedOutline: classes.noBorder },
  };

  const handleSubmitUser = (e) => {
    e.preventDefault();
    setFetching(true);
    const userData = {
      userId: userState.userId,
      email: formData.email.value,
      firstName: formData.firstname.value,
      lastName: formData.lastname.value,
      birthdate: formData.birthday.value,
      role: userState.role,
    };
    editUser(userData)
      .then((res) => {
        if (res.errorCode) {
          setFormData({
            email: {
              ...formData.email,
              isValid: false,
            },
            firstname: {
              ...formData.firstname,
              isValid: false,
            },
            lastname: {
              ...formData.lastname,
              isValid: false,
            },
            birthday: {
              ...formData.birthday,
              isValid: false,
            },
          });
          setErrorData(res);
          setErrorSubmit(true);
          setFetching(false);
          return;
        }
        setUserState({
          ...userState,
          email: formData.email.value,
          firstName: formData.firstname.value,
          lastName: formData.lastname.value,
          birthdate: formData.birthday.value,
        });
        setFetching(false);
        setErrorSubmit(false);
        setEditing(false);
      })
      .catch((err) => {});
  };

  return (
    <div className={classes.profileContent}>
      <div className={classes.header}>
        <Typography className={classes.userGreeting} variant={'h2'}>
          Hello, {userState.firstName}...
        </Typography>
      </div>

      <form autoComplete='off' onSubmit={handleSubmitUser}>
        <Box className={classes.profileDetails}>
          <div className={classes.userDetailsHeader}>
            <Typography variant={'h4'}>User Details</Typography>
            {editing ? (
              <CloseIcon
                className={classes.editIcon}
                onClick={() => setEditing(false)}
              />
            ) : (
              <BorderColorIcon
                className={classes.editIcon}
                onClick={() => {
                  setEditing(true);
                }}
              />
            )}
          </div>

          <Box className={classes.userInfo}>
            <div>
              {editing ? (
                <div className={classes.detailField}>
                  <Fade in={editing}>
                    <TextField
                      required
                      name={fields.firstName}
                      value={formData.firstname.value}
                      className={classes.formInput}
                      fullWidth
                      onChange={handleChangeFirstName}
                      InputProps={inputProp}
                      error={!formData.firstname.isValid}
                    />
                  </Fade>
                  <Fade in={editing}>
                    <TextField
                      required
                      name={fields.lastName}
                      value={formData.lastname.value}
                      className={classes.formInput}
                      fullWidth
                      onChange={handleChangeLastName}
                      InputProps={inputProp}
                      error={!formData.lastname.isValid}
                    />
                  </Fade>
                </div>
              ) : (
                <>
                  <Typography className={classes.fullName} variant={'h5'}>
                    {userState.firstName} {userState.lastName}
                  </Typography>
                </>
              )}
            </div>
            <Typography className={classes.detailFieldName} variant={'h6'}>
              {userState.role}
            </Typography>

            <Box className={classes.userDetails}>
              <div className={classes.userDetail}>
                <AlignedTextIcon>
                  <EmailIcon></EmailIcon>
                  <div className={classes.detailField}>
                    <Typography
                      className={classes.detailFieldName}
                      variant={'body1'}
                    >
                      Email:
                    </Typography>
                    {editing ? (
                      <Fade in={editing}>
                        <TextField
                          required
                          name={fields.email}
                          value={formData.email.value}
                          className={classes.formInput}
                          fullWidth
                          onChange={handleChangeEmail}
                          InputProps={inputProp}
                          error={!formData.email.isValid}
                        />
                      </Fade>
                    ) : (
                      <Typography variant={'body1'}>
                        {userState.email}
                      </Typography>
                    )}
                  </div>
                </AlignedTextIcon>
              </div>

              <div className={classes.userDetail}>
                <AlignedTextIcon>
                  <CakeIcon></CakeIcon>
                  <div className={classes.detailField}>
                    <Typography
                      className={classes.detailFieldName}
                      variant={'body1'}
                    >
                      Birthday:
                    </Typography>
                    {editing ? (
                      <PastDateSelector
                        selectedDate={formData.birthday.value}
                        handleDateChange={handleChangeBirthday}
                      />
                    ) : (
                      <Typography variant={'body1'}>
                        {moment(userState.birthdate).format(
                          'MMMM Do YYYY'
                        )}
                      </Typography>
                    )}
                  </div>
                </AlignedTextIcon>
              </div>

              <div className={classes.userDetail}>
                <AlignedTextIcon>
                  <EventIcon></EventIcon>
                  <div className={classes.detailField}>
                    <Typography
                      className={classes.detailFieldName}
                      variant={'body1'}
                    >
                      Registration Date:
                    </Typography>
                    <Typography variant={'body1'}>
                      {moment(userState.registrationDate).format(
                        'MMMM Do YYYY'
                      )}
                    </Typography>
                  </div>
                </AlignedTextIcon>
              </div>
            </Box>
          </Box>
        </Box>

        {editing ? (
          <Fade in={editing}>
            <Box className={classes.submitButton}>
              <SubmitButton
                placeholder='submit'
                isFetching={isFetching}
                disableIf={
                  !formData.email.isValid ||
                  !formData.firstname.isValid ||
                  !formData.lastname.isValid ||
                  formData.email.value === '' ||
                  formData.firstname.value === '' ||
                  formData.lastname.value === '' ||
                  isFetching
                }
              />
            </Box>
          </Fade>
        ) : null}
      </form>
    </div>
  );
};

export default ProfileContent;
