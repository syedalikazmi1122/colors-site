import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import TopSection from './Components/Landingpage/topsection';
import SecondSection from './Components/Landingpage/secondsection';
import ThirdSection from './Components/Landingpage/thirdsection';
import Footer from './Components/Landingpage/footer';
import EmailSignup from './Components/Landingpage/emailsection';
import LargeSamples from './Components/Landingpage/largesamples';
import BedroomRefresh from './Components/Landingpage/bedroom';
import EmailandInstagram from './Components/Landingpage/emailandinstagram';

function App() {
  return (
    <>
      <Navbar />
      <TopSection />
      <SecondSection/>
      <ThirdSection/>
      <EmailSignup/>
      <LargeSamples/>
      <BedroomRefresh/>
      <EmailandInstagram/>
      <Footer/>
    </>
  );
}

export default App;
