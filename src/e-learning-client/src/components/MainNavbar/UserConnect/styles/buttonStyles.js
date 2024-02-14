import mainTheme from '../../../../themes/main.theme';
import mainThemeEnum from '../../../../themes/main.theme.enum';

const buttonStyles = {
  jumpShadow: {
    '&:hover': {
      backgroundColor: mainTheme.palette.background.default,
      boxShadow: `-5px 5px 0px -1px ${mainTheme.palette.text.primary}`,
      transform: 'translate(4px, -4px)',
    },
    padding: 0,
    transition: 'boxShadow 0s',
  },
  jumpShadowBorder: {
    '&:hover': {
      backgroundColor: mainTheme.palette.background.default,
      boxShadow: `-5px 5px 0px -1px ${mainTheme.palette.text.primary}`,
      transform: 'translate(4px, -4px)',
    },
    border: mainThemeEnum.border.medium,
    padding: mainTheme.spacing(1),
    transition: 'boxShadow 0s',
  },
  jumpShadowGreen: {
    '&:hover': {
      backgroundColor: mainTheme.palette.background.default,
      boxShadow: `-5px 5px 0px -1px ${mainTheme.palette.primary.main}`,
      transform: 'translate(4px, -4px)',
    },
    padding: mainTheme.spacing(1),
    transition: 'boxShadow 0s',
  },
};

export default buttonStyles;
