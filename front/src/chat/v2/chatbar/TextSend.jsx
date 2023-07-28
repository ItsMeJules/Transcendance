import React from "react";

import RightArrow from "../../../assets/arrow-right.png"

const TextSend = ({hasText, setValue, value, sendData}) => {
  const sendStyle = {
    transition: "transform 0.3s ease",
  }

  const handleHover = (event) => {
    event.target.style.transform = "scale(1.2)";
  };

  const handleHoverOut = (event) => {
    event.target.style.transform = "scale(1)";
  };

  console.log(hasText)

  return (
    <div className="text-send">
      <img
        className="arrow-img"
        alt="Send"
        src={RightArrow}
        style={sendStyle}
        onMouseEnter={hasText ? handleHover : null}
        onMouseLeave={hasText ? handleHoverOut : null}
        onClick={() => {
          sendData(value)
          setValue("")
        }}
      />
    </div>
  )
}

export default TextSend;