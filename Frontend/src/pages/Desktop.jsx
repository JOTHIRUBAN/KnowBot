import React, { useRef } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import Mission from '@/components/Mission';
import Features from '@/components/Features';
import Team from '@/components/Team';
import GetStarted from '@/components/GetStarted';
import Logo from '@/components/Logo';

function Desktop() {
  // Create refs for each section
  const homeRef = useRef(null);
  const featuresRef = useRef(null);
  const tryOutRef = useRef(null);
  const teamRef = useRef(null);
  const contactRef = useRef(null);

  // Function to scroll to the respective section
  const scrollToSection = (section) => {
    switch(section) {
      case 'home':
        homeRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'features':
        featuresRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'try-out':
        tryOutRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'team':
        teamRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'contact':
        contactRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  return (
    <div className='bg-black w-screen h-screen'>
      <Logo page='Desktop' />
      <Navbar scrollToSection={scrollToSection} />
      <div ref={homeRef} id="home">
        <Hero />
      </div>
      <div ref={featuresRef} id="features">
        <Features />
      </div>
      <div ref={tryOutRef} id="try-out">
        <GetStarted />
      </div>
        <Mission />
      <div ref={teamRef} id="team">
        <Team />
      </div>
      
      <div ref={contactRef} id="contact">
        <Footer />
      </div>
      
    </div>
  );
}

export default Desktop;
