import { createTheme } from '@material-ui/core';

const mainTheme = createTheme({
  mixins: {
    toolbar: {
      minHeight: 88,
    },
  },
  palette: {
    common: {
      black: '#3A3A3A',
      white: '#fafafa',
    },
    background: {
      default: '#fdf6e3',
      paper: '#fafafa',
    },
    primary: {
      main: '#2aa198',
      light: '#8ad1c2e5',
    },
    secondary: {
      main: '#d33682',
    },
    error: {
      main: '#dc322f',
    },
    warning: {
      main: '#b58900',
    },
    info: {
      main: '#268bd2',
    },
    success: {
      main: '#2aa198',
    },

    text: {
      primary: '#3A3A3A',
    },
    action: {
      active: '#5AA897',
    },
  },
  typography: {
    fontFamily: 'Quicksand',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
  shape: {
    borderRadius: '0',
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});

export default mainTheme;
