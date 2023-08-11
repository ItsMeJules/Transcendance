import React, { useState } from "react";
import Popup from "./Popup";

export default function ChatMetadata() {
  const [isMoreActive, setIsMoreActive] = useState(false);

  const handleMoreClick = () => {
    setIsMoreActive(!isMoreActive);
  };

  return (
    <div className="metadata-container">
      <div className="more" onClick={handleMoreClick}>

        <div className={"more-symbol " + (isMoreActive ? "active" : "")}>
          {isMoreActive &&
            <Popup className="more-popup">
              <p>Créer un channel</p>
              <p>Envoyer un dm</p>
              <p>Bloquer/Débloquer un utilisateur</p>
            </Popup>
          }
          
          <span></span> {/* Useful for the more symbol animation */}

        </div>
      </div>

      <div className="metadata">
        <div className="chat-info"></div>
        <div className="chat-icon"></div>
      </div>
    </div>
  );
}