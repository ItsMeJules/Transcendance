import { useRef, useState, useEffect } from 'react';
import { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Particle from '../components/Particle';
import { pulse, glow1, glow2, GlowText, PulseGlowText } from '../utils';

export const Home = () => {
  const videoRef = useRef(null);
  const [playSecondVideo, setPlaySecondVideo] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
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
  const handleVideoEnd = () => {
    setShowVideo(false);
  };

  const handleTransitionEnd = () => {
    if (playSecondVideo) {
      history('/login');
    }
  };

  const handleTimeUpdate = () => {
    // if (playSecondVideo && video2Ref.current && video2Ref.current.currentTime >= video2Ref.current.duration) {
      history('/login');
    // }
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

  const video2Classes = `video video2 ${playSecondVideo ? 'fade-in' : 'fade-out'}`;
  const div2Classes = `background-video ${showVideo ? 'show' : 'hide'}`;

  return (
    <div>

      <Particle />

      <div style={{ position: 'relative', zIndex: '2' }}>
      {playSecondVideo && (
        <video ref={video2Ref}
        id="videoTransition"
        className="video2Classes absolute top-0 left-0 w-full h-full bg-video"
        src="hyperspace.mp4"
        autoPlay
        muted
        onEnded={handleVideoEnd}
        onTimeUpdate={handleTimeUpdate}></video>
      )}
      </div>

      <div className='flex justify-center mx-auto items-center text-white max-w-700 w-full sm:w-250' style={{ height: '150px', position: 'relative', zIndex: '3' }}>

        <GlowText className="flex font-bold" style={{ fontSize: screenSize.width * 0.05 > 75 ? 75 : screenSize.width * 0.05 }}>
          ft_transcendance
        </GlowText>

      </div>

      <div className="flex justify-center mx-auto text-white font-bold" style={{ paddingTop: '300px'}}>
          <PulseGlowText onClick={handleButtonClick} className="flex text-xl font-bold" style={{ fontSize: screenSize.width * 0.1 > 200 ? 200 : screenSize.width * 0.1 }}>
            Play
          </PulseGlowText> 
      </div>

    </div >
  )
}