import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import { useContext } from 'react';
import CatalogueContext from '../../../context/CatalogueContext';
import mainTheme from '../../../themes/main.theme';
import Category from './Category';

const useStyles = makeStyles({
  categoriesContainer: {
    // alignContent: 'center',
  },
  title: {
    marginBottom: mainTheme.spacing(3),
    userSelect: 'none',
  },
  sectionContainer: {
    marginTop: mainTheme.spacing(5),
    paddingTop: mainTheme.spacing(3),
    paddingBottom: mainTheme.spacing(5),
  },
});

const CategoriesSection = () => {
  const classes = useStyles();
  const { catalogueState } = useContext(CatalogueContext);

  return (
    <>
      <Container className={classes.sectionContainer}>
        <Typography variant={'h4'} className={classes.title}>
          Explore our most popular categories
        </Typography>
        <Grid container>
          <Grid
            item
            container
            className={classes.categoriesContainer}
            spacing={2}
          >
            {catalogueState.popularTopics?.map((category) => (
              <Grid
                key={category.topicId}
                item
                sm={6}
                className={classes.category}
              >
                <Category category={category} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CategoriesSection;
