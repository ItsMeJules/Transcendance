import React, { useState, useEffect } from 'react';
import BackgroundMoving from 'layout/BackgroundMoving/BackgroundMoving';
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
    <div style={{ position: "relative" }}>
      <BackgroundMoving key={location.state?.key} style={{ position: "absolute", top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <VideoSection playSecondVideo={playSecondVideo} handleTimeUpdate={handleTimeUpdate} />
        <TextSection screenSize={screenSize} handleButtonClick={handleButtonClick} />
      </div>
    </div>
  );
};

export default Home;
