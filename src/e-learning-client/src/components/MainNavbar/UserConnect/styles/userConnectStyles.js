import mainTheme from '../../../../themes/main.theme';
import mainThemeEnum from '../../../../themes/main.theme.enum';

const userConnectStyles = {
  registrationPanel: {
    margin: mainTheme.spacing(3),
    padding: mainTheme.spacing(5),
    backgroundColor: mainTheme.palette.background.default,
    maxWidth: '500px',
    maxHeight: '665px',
    overflow: 'hidden',
    border: mainThemeEnum.border.bold,
  },
  toggleButton: {
    marginBottom: mainTheme.spacing(3),
    border: 'none',
    color: mainTheme.palette.common.black,
  },
  inputFormStyling: {
    formInput: {
      backgroundColor: mainTheme.palette.common.white,
    },
    formTitle: {
      fontWeight: mainTheme.typography.fontWeightBold,
    },
    grow: {
      flexGrow: 1,
    },
    noBorder: {
      border: mainThemeEnum.border.medium,
    },
    passwordInfo: {
      marginLeft: mainTheme.spacing(5),
      padding: mainTheme.spacing(2),
      backgroundColor: mainTheme.palette.background.paper,
      border: mainThemeEnum.border.medium,
      zIndex: 1500,
    },
    passwordInput: {
      letterSpacing: '5px',
    },
    registrationForm: {
      marginTop: mainTheme.spacing(3),
    },
    submitButton: {
      marginTop: '30px',
      marginBottom:'30px',
      display:'flex',
      justifyContent:'flex-end'
    }
  },
};

export default userConnectStyles;
