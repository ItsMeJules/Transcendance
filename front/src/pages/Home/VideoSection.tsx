import React, { useRef, useEffect } from 'react';

interface VideoSectionProps {
  playSecondVideo: boolean;
  handleTimeUpdate: () => void;
}

const VideoSection: React.FC<VideoSectionProps> = ({ playSecondVideo, handleTimeUpdate }) => {
  const video2Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (video2Ref.current) {
      if (playSecondVideo) {
        video2Ref.current.style.opacity = '1';
        video2Ref.current.play();
      } else {
        video2Ref.current.style.opacity = '0';
        video2Ref.current.pause();
      }
    }
  }, [playSecondVideo]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, width: '100%', height: '100%' }}>
      {playSecondVideo && (
        <video
          ref={video2Ref}
          id="videoTransition"
          className="video2Classes absolute top-0 left-0 w-full h-full bg-video"
          src="hyperspace.mp4"
          autoPlay
          muted
          onTimeUpdate={handleTimeUpdate}
        ></video>
      )}
    </div>
  );
};

export default VideoSection;
