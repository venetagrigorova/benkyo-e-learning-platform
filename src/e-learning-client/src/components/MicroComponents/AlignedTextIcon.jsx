import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  flexTextIcon: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary,
    flexShrink: 1,
    flexWrap: 'wrap',
    '& :first-child': {
      fontSize: theme.typography.fontSize * 1.3,
      marginRight: theme.spacing(1),
    },
    '& > svg': {
      color: theme.palette.primary.main,
    },
  },
}));

const AlignedTextIcon = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.flexTextIcon}>{children}</div>;
};

export default AlignedTextIcon;
