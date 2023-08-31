import React, { MouseEvent } from "react";

interface TextSendProps {
  hasText: boolean;
  handleSend: () => void;
}

const TextSend: React.FC<TextSendProps> = ({ hasText, handleSend }) => {
  const sendStyle = {
    transition: "transform 0.3s ease",
  };

  const handleHover = (event: MouseEvent<HTMLImageElement>) => {
    event.currentTarget.style.transform = "scale(1.2)";
  };

  const handleHoverOut = (event: MouseEvent<HTMLImageElement>) => {
    event.currentTarget.style.transform = "scale(1)";
  };

  return (
    <div className="text-send">
      <img
        className="arrow-img"
        alt="Send"
        src="/images/arrow-right.png"
        style={sendStyle}
        onMouseEnter={hasText ? handleHover : undefined}
        onMouseLeave={hasText ? handleHoverOut : undefined}
        onClick={handleSend}
      />
    </div>
  );
};

export default TextSend;
