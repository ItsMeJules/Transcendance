import React, { useState } from "react";

export default function ChatMetadata() {
  const [isMoreActive, setIsMoreActive] = useState(false);

  const handleMoreClick = () => {
    setIsMoreActive(!isMoreActive);
  };

  return (
    <div className="metadata-container">
      <div className="more" onClick={handleMoreClick}>
        <div className={"more-symbol " + (isMoreActive ? "active" : "")}>
          <span></span>
        </div>
      </div>

      <div className="metadata">
        <div className="chat-info"></div>
        <div className="chat-icon"></div>
      </div>
    </div>
  );
}