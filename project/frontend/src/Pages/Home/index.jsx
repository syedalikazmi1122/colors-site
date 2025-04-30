import Navbar from './../../Components/Navbar/index.jsx';
import TopSection from './../../Components/Landingpage/topsection';
import SecondSection from './../../Components/Landingpage/secondsection';
import ThirdSection from './../../Components/Landingpage/thirdsection';
import Footer from '../../Components/Footer/index.jsx';
import EmailSignup from './../../Components/Landingpage/emailsection';
import LargeSamples from './../../Components/Landingpage/largesamples';
import BedroomRefresh from './../../Components/Landingpage/bedroom';
import EmailandInstagram from './../../Components/Landingpage/emailandinstagram';
import { useEffect } from 'react';
import { useState } from 'react';
import sendRequest from '../../Utils/apirequest';

export default function LandingPage() {
  const [TopSectionData, setTopSectionData] = useState([]);
  const [SecondSectionData, setSecondSectionData] = useState([]);
  const [ThirdSectionData, setThirdSectionData] = useState([]);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendRequest('get', '/homepagetop', {});
        console.log("response", response) 
        if (response.data.success) {
          setBanners(response.data.data.banners);
          setInstagramPosts(response.data.data.instagramProducts);
        }
      } catch (error) {
        console.error('Error fetching banners and Instagram posts:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <TopSection TopSectionData={banners} />
      <SecondSection SecondSectionData={SecondSectionData}/> 
      <ThirdSection/>
      <EmailSignup ThirdSectionData={ThirdSectionData}/>
      {/* <LargeSamples/> */}
      {/* <BedroomRefresh/> */}
      <EmailandInstagram instagramPosts={instagramPosts}/>
      <Footer/>
    </>
  );
}
