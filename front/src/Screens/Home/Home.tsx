import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Particle from '../../Components/Particle';
import { GlowText, PulseGlowText } from '../../Utils';
import { connectSocket } from '../../Websocket/Socket.io';

export const Home = () => {
  // const videoRef = useRef(null);
  const [playSecondVideo, setPlaySecondVideo] = useState(false);
  // const [showVideo, setShowVideo] = useState(true);
  const history = useNavigate(); // Create a navigate object for navigation
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (playSecondVideo) {
      if (video1Ref.current) {
        video1Ref.current.style.setProperty('opacity', '0');
        video1Ref.current.pause();
      }
      if (video2Ref.current) {
        video2Ref.current.style.setProperty('opacity', '1');
        video2Ref.current.play();
      }
    } else {
      if (video1Ref.current) {
        video1Ref.current.style.setProperty('opacity', '1');
        video1Ref.current.play();
      }
      if (video2Ref.current) {
        video2Ref.current.style.setProperty('opacity', '0');
        video2Ref.current.pause();
      }
    }
  }, [playSecondVideo]);

  const handleButtonClick = () => {
    setPlaySecondVideo(true);
  };

  // const handleVideoEnd = () => {
  //   setShowVideo(false);
  // };

  // const handleTransitionEnd = () => {
  //   if (playSecondVideo) {
  //     history('/login');
  //   }
  // };

  const handleTimeUpdate = () => {
    // if (playSecondVideo && video2Ref.current && video2Ref.current.currentTime >= video2Ref.current.duration) {
      history('/login', { state: { key: Date.now() } });    // }
  };

  const getCurrentDimension = () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension())
    }
    window.addEventListener('resize', updateDimension);

    return (() => {
      window.removeEventListener('resize', updateDimension);
    })
  }, [screenSize])

  // const video2Classes = `video video2 ${playSecondVideo ? 'fade-in' : 'fade-out'}`;
  // const div2Classes = `background-video ${showVideo ? 'show' : 'hide'}`;

return (
  <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>

    {/* Wrap Particle in a div to control its z-index */}
    <div style={{ zIndex: 0, position: 'absolute', width: '100%', height: '100%' }}>
      <Particle />
    </div>

    <div style={{ position: 'absolute', top: '0', left: '0', zIndex: 1, width: '100%', height: '100%' }}>
      {playSecondVideo && (
        <video ref={video2Ref}
          id="videoTransition"
          className="video2Classes absolute top-0 left-0 w-full h-full bg-video"
          src="hyperspace.mp4"
          autoPlay
          muted
          onTimeUpdate={handleTimeUpdate}
        ></video>
      )}
    </div>

    <div className="flex flex-col h-screen items-center" style={{ zIndex: 2 }}>

      <div className="text-white font-bold mt-10">
        <GlowText className="flex font-bold" style={{ fontSize: screenSize.width * 0.05 > 75 ? 75 : screenSize.width * 0.05 }}>
          ft_transcendance
        </GlowText>
      </div>

      <div className="text-white font-bold" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 1000 }}>
        <PulseGlowText onClick={handleButtonClick} className="flex text-xl font-bold" style={{ fontSize: screenSize.width * 0.1 > 200 ? 200 : screenSize.width * 0.1 }}>
          Play
        </PulseGlowText>
      </div>

    </div>
  </div>
);

  
}