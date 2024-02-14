import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import Layout from '../Layout';
import HomePrivate from './HomePrivate';
import HomePublic from './HomePublic';

const Home = () => {
  const { account } = useContext(AuthContext);

  return (
    <>
      <Layout>{account ? <HomePrivate /> : <HomePublic />}</Layout>
    </>
  );
};

export default Home;
