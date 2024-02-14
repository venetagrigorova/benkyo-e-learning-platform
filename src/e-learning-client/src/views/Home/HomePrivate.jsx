import { makeStyles, Typography } from '@material-ui/core';

const useStyle = makeStyles({
  emptyTemp: {
    minHeight: '1500px',
    marginTop: '50px',
  },
});

const HomePrivate = () => {
  const classes = useStyle();
  return (
    <>
      <div className={classes.emptyTemp}>
        <Typography>User Dashboard</Typography>
      </div>
    </>
  );
};

export default HomePrivate;
