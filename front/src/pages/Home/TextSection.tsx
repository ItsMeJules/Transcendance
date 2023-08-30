import React from 'react';
import { GlowText, PulseGlowText } from 'utils/cssAnimation/cssAnimation';

interface TextSectionProps {
  screenSize: { width: number; height: number };
  handleButtonClick: () => void;
}

const TextSection: React.FC<TextSectionProps> = ({ screenSize, handleButtonClick }) => {
  return (
    <div className="flex flex-col h-screen items-center" style={{ zIndex: 2 }}>
      <div className="text-white font-bold mt-10">
        <GlowText className="flex font-bold" style={{ fontSize: screenSize.width * 0.05 > 75 ? 75 : screenSize.width * 0.05 }}>
          ft_transcendance
        </GlowText>
      </div>
      <div className="text-white font-bold" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 1000 }}>
        <PulseGlowText onClick={handleButtonClick} className="flex text-xl font-bold" style={{ fontSize: screenSize.width * 0.1 > 200 ? 200 : screenSize.width * 0.1 }}>
          Start
        </PulseGlowText>
      </div>
    </div>
  );
};

export default TextSection;
