import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  separator: {
    height: '3px',
    backgroundColor: theme.palette.text.primary,
    // borderTop: mainThemeEnum.border.medium,
    borderRadius: '100px',
    margin: theme.spacing(4),
  },
}));

const Separator = () => {
  const classes = useStyles();
  return <div className={classes.separator} />;
};

export default Separator;
