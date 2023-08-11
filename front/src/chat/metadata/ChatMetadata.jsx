import React, { useState } from "react";
import Popup from "./Popup";

export default function ChatMetadata() {
  const [isMoreActive, setIsMoreActive] = useState(false);
  const [mousePosition, setMousePos] = useState({x: 0, y: 0})

  const handleMoreClick = (event) => {
    const x = event.clientX;
    const y = event.clientY;

    setMousePos({x, y})
    setIsMoreActive(!isMoreActive);
  }

  return (
    <div className="metadata-container">
      <div className="more" onClick={handleMoreClick}>

        <div className={"more-symbol " + (isMoreActive ? "active" : "")}>
          <span></span> {/* Useful for the more symbol animation */}
        </div>

        {isMoreActive &&
            <Popup className="more-popup" mousePos={mousePosition}>
              <p>Créer un channel</p>
              <p>Envoyer un dm</p>
              <p>Bloquer/Débloquer un utilisateur</p>
            </Popup>
        }
      </div>

      <div className="metadata">
        <div className="chat-info"></div>
        <div className="chat-icon"></div>
      </div>
    </div>
  );
}