import debounce from 'lodash.debounce';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from 'utils/redux/Store';
import { setRightScreenState } from 'utils/redux/reducers/RightScreenSlice';
import { APP_ROUTES, APP_SCREENS } from "utils/routing/routing";


const NavFooter: React.FC = () => {
  const dispatch = useAppDispatch()
  const history = useNavigate();
  const [showFooter, setShowFooter] = useState(false);

  const handleMatchMakingClick = (() => {
    history(APP_ROUTES.MATCHMAKING)
  });

  const dispatchScreenState = (state: APP_SCREENS) => {
    dispatch(setRightScreenState(state))
  }

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
        <button onClick={() => dispatchScreenState(APP_SCREENS.ALL_USERS)}>
          <img src="/images/allusers.png" alt="allusers" />
        </button>
        <button onClick={() => dispatchScreenState(APP_SCREENS.CHAT)}>
          <img src="/images/chat.png" alt="chat" />
        </button>
        <button onClick={() => dispatchScreenState(APP_SCREENS.FRIENDS)}>
          <img src="/images/friends.png" alt="friends" />
        </button>
        <button onClick={() => dispatchScreenState(APP_SCREENS.LEADERBOARD)}>
          <img src="/images/leaderboard.png" alt="leaderboard" />
        </button>
        <button onClick={() => dispatchScreenState(APP_SCREENS.ONLINE_GAMES)}>
          <img src="/images/gamesonline.png" alt="gamesonline" />
        </button>
      </div>
    </main>
  );
};

export default NavFooter;
