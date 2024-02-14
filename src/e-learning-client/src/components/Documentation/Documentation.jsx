import { Container, Fab, makeStyles } from '@material-ui/core';
import parse from 'html-react-parser';
import documentation from './doc';
import { documentTitleSuffix } from '../../common/strings.enums';
import ScrollTop from '../ScrollTop/ScrollTop';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import mainThemeEnum from '../../themes/main.theme.enum';

const useStyles = makeStyles((theme) => ({
  scrollTopContainer: {
    background: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      boxShadow: `-1px 1px 0px -1px ${theme.palette.text.primary}`,
      transform: 'translate(1px, -1px)',
    },
    border: mainThemeEnum.border.medium,
    padding: theme.spacing(1),
    transition: 'boxShadow 0s',
    boxShadow: 'none',
  },
  scrollTopIcon: {
    fontSize: theme.typography.fontSize * 1.5,
  },
}));

const Documentation = () => {
  const classes = useStyles();

  document.title = `Documentation${documentTitleSuffix}`;

  return (
    <Container>
      <div id='top-anchor' />
      {parse(documentation)}
      <ScrollTop>
        <Fab
          size='medium'
          className={classes.scrollTopContainer}
          aria-label='scroll back to top'
        >
          <KeyboardArrowUpIcon className={classes.scrollTopIcon} />
        </Fab>
      </ScrollTop>
    </Container>
  );
};

export default Documentation;
