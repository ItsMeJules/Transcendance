import React, { useState, useEffect } from 'react';
import Particle from '../../layout/Particle';
import VideoSection from './VideoSection';
import TextSection from './TextSection';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [playSecondVideo, setPlaySecondVideo] = useState(false);
  const history = useNavigate();
  
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', updateDimension);
    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, []);

  const handleButtonClick = () => {
    setPlaySecondVideo(true);
  };

  const handleTimeUpdate = () => {
    history('/login', { state: { key: Date.now() } });
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <div style={{ zIndex: 0, position: 'absolute', width: '100%', height: '100%' }}>
        <Particle />
      </div>
      <VideoSection playSecondVideo={playSecondVideo} handleTimeUpdate={handleTimeUpdate} />
      <TextSection screenSize={screenSize} handleButtonClick={handleButtonClick} />
    </div>
  );
};

export default Home;
