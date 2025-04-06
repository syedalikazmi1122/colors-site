import Navbar from './../../Components/Navbar/index.jsx';
import TopSection from './../../Components/Landingpage/topsection';
import SecondSection from './../../Components/Landingpage/secondsection';
import ThirdSection from './../../Components/Landingpage/thirdsection';
import Footer from '../../Components/Footer/index.jsx';
import EmailSignup from './../../Components/Landingpage/emailsection';
import LargeSamples from './../../Components/Landingpage/largesamples';
import BedroomRefresh from './../../Components/Landingpage/bedroom';
import EmailandInstagram from './../../Components/Landingpage/emailandinstagram';
import { useEffect,useState } from 'react';
import sendRequest from '../../Utils/apirequest.js';

export default function LandingPage() {
  const [TopSectionData, setTopSectionData] = useState([]);
  const [SecondSectionData, setSecondSectionData] = useState([]);
  const [ThirdSectionData, setThirdSectionData] = useState([]);
  
 useEffect(() => {
  const fetchData = async () => {
    try{
      const response = await sendRequest("get", "/homepagetopsvg", null);
      console.log("Categories:", response.data);  
      setTopSectionData(response.data);    
    }
    catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
  fetchData();
}
, []);
useEffect(() => {
  const fetchData = async () => {
    try{
      const response = await sendRequest("get", "/homepagerandomsvgs", null);
      console.log("Categories:", response.data);  
      setSecondSectionData(response.data);    
    }
    catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
  fetchData();
}

, []);
useEffect(() => {
  const fetchData = async () => {
    try{
      const response = await sendRequest("get", "/homepagesvgcategories", null);
      console.log("Categories:", response.data);  
      setThirdSectionData(response.data);    
    }
    catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
  fetchData();
}
, []);


  return (
    <>
      <Navbar />
      <TopSection TopSectionData={TopSectionData} />
      <SecondSection SecondSectionData={SecondSectionData}/>
      {/* <ThirdSection/> */}
      <EmailSignup ThirdSectionData={ThirdSectionData}/>
      <EmailandInstagram/>
      <Footer/>
    </>
  );
}
