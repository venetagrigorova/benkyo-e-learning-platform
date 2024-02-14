import Layout from '../Layout';
import CategoryChips from '../../components/CatalogueCourses/CategoryChips/CategoryChips';
import CatalogueCourses from '../../components/CatalogueCourses';
import { useContext } from 'react';
import CatalogueContext from '../../context/CatalogueContext';
import CategoryDrawer from '../../components/CatalogueCourses/CategoryDrawer/CategoryDrawer';

const Catalogue = ({ location }) => {
  const { catalogueState } = useContext(CatalogueContext);

  return (
    <>
      <Layout>
        <CategoryDrawer />
        {!!catalogueState.activeTopics.length && <CategoryChips />}
        <CatalogueCourses location={location} />
      </Layout>
    </>
  );
};

export default Catalogue;
