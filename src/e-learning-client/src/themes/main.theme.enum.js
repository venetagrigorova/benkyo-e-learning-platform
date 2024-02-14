import mainTheme from './main.theme';

const mainThemeEnum = {
  marginNavbar: (offset = 0) => {
    return `${90 + offset}px`;
  },
  border: {
    thin: `1px solid ${mainTheme.palette.text.primary}`,
    medium: `2px solid ${mainTheme.palette.text.primary}`,
    bold: `3px solid ${mainTheme.palette.text.primary}`,
  },
  borderGreen: {
    thin: `1px solid ${mainTheme.palette.primary.main}`,
    medium: `2px solid ${mainTheme.palette.primary.main}`,
    bold: `3px solid ${mainTheme.palette.primary.main}`,
  },
  borderPlaceholder: {
    thin: `1px solid rgba(0,0,0,0)`,
    medium: `2px solid rgba(0,0,0,0)`,
    bold: `3px solid rgba(0,0,0,0)`,
  },
  sizing: {
    drawerWidth: '200px',
    menuDrawerWidth: '240px',
  },
};

export default mainThemeEnum;
