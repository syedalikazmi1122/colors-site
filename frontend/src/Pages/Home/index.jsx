import Navbar from './../../Components/Navbar/index.jsx';
import TopSection from './../../Components/Landingpage/topsection';
import SecondSection from './../../Components/Landingpage/secondsection';
import ThirdSection from './../../Components/Landingpage/thirdsection';
import Footer from '../../Components/Footer/index.jsx';
import EmailSignup from './../../Components/Landingpage/emailsection';
import LargeSamples from './../../Components/Landingpage/largesamples';
import BedroomRefresh from './../../Components/Landingpage/bedroom';
import EmailandInstagram from './../../Components/Landingpage/emailandinstagram';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <TopSection />
      <SecondSection/>
      <ThirdSection/>
      <EmailSignup/>
      {/* <LargeSamples/> */}
      {/* <BedroomRefresh/> */}
      <EmailandInstagram/>
      <Footer/>
    </>
  );
}
