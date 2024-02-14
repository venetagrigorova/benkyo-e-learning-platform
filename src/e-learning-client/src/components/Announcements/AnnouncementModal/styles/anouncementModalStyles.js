import mainTheme from '../../../../themes/main.theme';
import mainThemeEnum from '../../../../themes/main.theme.enum';

const announcementModalStyles = {
  announcementPanel: {
    margin: mainTheme.spacing(3),
    padding: mainTheme.spacing(5),
    backgroundColor: mainTheme.palette.background.default,
    maxWidth: '500px',
    height: 'fit-content',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: "center",
    alignItems: 'center',
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
    announcementForm: {
      marginTop: mainTheme.spacing(3),
    },
    submitButton: {
      marginTop: '30px',
      display:"flex",
      justifyContent:"flex-end"
    }
  },
  deletePanelStyling: {
    formTitle: {
      fontWeight: mainTheme.typography.fontWeightBold,
      marginBottom: mainTheme.spacing(3),
    },
    submitButton: {
      marginTop: '30px',
      display:"flex",
      justifyContent:"flex-end"
    }
  },
};

export default announcementModalStyles;
