import { Container, makeStyles } from '@material-ui/core';
import Footer from '../../components/Footer/Footer';
import CategoriesSection from '../../components/Home/CategoriesSection';
import mainThemeEnum from '../../themes/main.theme.enum';

const useStyle = makeStyles({
  emptyTemp: {},
  bottomDivider: {
    marginTop: '50px',
    border: mainThemeEnum.border.thin,
  },
  topDivider: {
    marginTop: '50px',
    marginBottom: '20px',
    border: mainThemeEnum.border.thin,
  },
});

const HomePublic = () => {
  const classes = useStyle();

  return (
    <>
      <Container className={classes.emptyTemp}>
        <CategoriesSection />
      </Container>
      <Footer />
    </>
  );
};

export default HomePublic;
