import Layout from "../Layout";
import { useContext } from "react";
import CatalogueContext from "../../context/CatalogueContext";
import MyCoursesContent from "../../components/MyCourses/MyCourses";

const MyCourses = () => {
  const { catalogueState } = useContext(CatalogueContext);
  const myCourses = catalogueState.courses.filter((course) => course.isEnrolled);

  return (
    <>
      <Layout>
        <MyCoursesContent myCourses={myCourses} />
      </Layout>
    </>
  );
};

export default MyCourses;
