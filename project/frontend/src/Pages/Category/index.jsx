import React, { useEffect } from "react";
import BreadCrumb from "../../Components/BreadCrumb";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import CategoryTop from "../../Components/Category/topsection";
import CategoryLayout from "../../Components/Category/Categorylayout";
import sendRequest from "../../Utils/apirequest";
import { useParams } from "react-router-dom";

export default function CategoryPage() {
  const [categoryData, setCategoryData] = React.useState([]);
  const category = useParams().category;

  console.log("Category:", category);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendRequest("get", "/svgs/category/" + category, null);
        console.log("Categories:", response.data);
        setCategoryData(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, [category]);

  // Select the first image or a fallback if no images are available
  const selectedImage = categoryData.length > 0 ? categoryData[0] : null;

  return (
    <>
      <Navbar />
      <BreadCrumb category={category} /> {/* Pass category as a prop */}
      <CategoryTop image={selectedImage} /> {/* Pass the selected image as a prop */}
      <CategoryLayout categoryData={categoryData} />
      <Footer />
    </>
  );
}