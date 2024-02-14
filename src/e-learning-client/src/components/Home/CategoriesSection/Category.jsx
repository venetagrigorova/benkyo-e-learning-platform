import {
  Button,
  Card,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import mainThemeEnum from '../../../themes/main.theme.enum';
import buttonStyles from '../../MainNavbar/UserConnect/styles/buttonStyles';
const useStyles = makeStyles((theme) => ({
  buttonCard: {
    ...buttonStyles.jumpShadow,
    width: '100%',
  },
  card: {
    display: 'flex',
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    border: mainThemeEnum.border.bold,
    userSelect: 'none',
    width: '100%',
  },
  cardInner: {
    margin: theme.spacing.apply(2),
    backgroundColor: theme.palette.background.default,
    minWidth: '190px',
  },
  categoryCard: {
    border: mainThemeEnum.border.bold,
    width: '100%',
  },
  categoryLabel: {
    underline: 'none',
    textDecoration: 'none',
  },
}));
const Category = ({ category }) => {
  const classes = useStyles();

  return (
    <Link
      to={`/catalogue?categories=${category.topicName}`}
      className={classes.categoryLabel}
    >
      <Button className={classes.buttonCard}>
        <Card className={classes.categoryCard} elevation={0}>
          <Card className={classes.cardInner} elevation={0}>
            <CardContent className={classes.card}>
              <Typography
                type='button'
                className={classes.categoryLabel}
                variant={'h5'}
              >
                {category.topicName}
              </Typography>
            </CardContent>
          </Card>
        </Card>
      </Button>
    </Link>
  );
};

export default Category;
