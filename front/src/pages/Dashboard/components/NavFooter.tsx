import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { APP_ROUTES, APP_SCREENS } from "utils/routing/routing";
import debounce from 'lodash.debounce';


interface LeftNavFooterProps {
  setRightContent: (option: number) => void;
}

const NavFooter: React.FC<LeftNavFooterProps> = ({ setRightContent }) => {
  const debouncedSetRightContent = useCallback(debounce(setRightContent, 10), [setRightContent]);
  const history = useNavigate();

  const handleMatchMakingClick = (() => {
    history(APP_ROUTES.MATCHMAKING)
  });

  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mouseY = event.clientY;
      const windowHeight = window.innerHeight;

      // Show the footer if the mouse is within 50 pixels of the bottom of the screen
      if (mouseY > windowHeight - 50) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup: remove event listener when the component is unmounted
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array means this effect runs once when the component mounts



  return (
    <main className={`nav-footer-container ${showFooter ? 'visible' : 'hidden'}`}>
      <div className="icons">
        <button onClick={handleMatchMakingClick}>
          <img src="/images/game.png" alt="game" />
        </button>
        <button onClick={() => debouncedSetRightContent(APP_SCREENS.ALL_USERS)}>
          <img src="/images/allusers.png" alt="allusers" />
        </button>
        <button onClick={() => debouncedSetRightContent(APP_SCREENS.CHAT)}>
          <img src="/images/chat.png" alt="chat" />
        </button>
        <button onClick={() => debouncedSetRightContent(APP_SCREENS.FRIENDS)}>
          <img src="/images/friends.png" alt="friends" />
        </button>
        <button onClick={() => debouncedSetRightContent(APP_SCREENS.LEADERBOARD)}>
          <img src="/images/leaderboard.png" alt="leaderboard" />
        </button>
        <button onClick={() => debouncedSetRightContent(APP_SCREENS.ONLINE_GAMES)}>
          <img src="/images/gamesonline.png" alt="gamesonline" />
        </button>
      </div>
    </main>
  );
};

export default NavFooter;
