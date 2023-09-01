import { useNavigate } from "react-router-dom";
import { APP_ROUTES, APP_SCREENS } from "utils/routing/routing";

interface LeftNavFooterProps {
  setRightContent: (option: number) => void;
}

const NavFooter: React.FC<LeftNavFooterProps> = ({ setRightContent }) => {
  const history = useNavigate();

  const handleMatchMakingClick = (() => {
    history(APP_ROUTES.MATCHMAKING)
  });
  const handleSpectateClick = (() => { })

  return (
    <main className="nav-footer-container">
      <div className="icons">
        <button onClick={handleMatchMakingClick}>
          <img src="/images/game.png" alt="game" />
        </button>
        <button onClick={() => setRightContent(APP_SCREENS.ALL_USERS)}>
          <img src="/images/allusers.png" alt="allusers" />
        </button>
        <button onClick={() => setRightContent(APP_SCREENS.CHAT)}>
          <img src="/images/chat.png" alt="chat" />
        </button>
        <button onClick={() => setRightContent(APP_SCREENS.FRIENDS)}>
          <img src="/images/friends.png" alt="friends" />
        </button>
        <button onClick={() => setRightContent(APP_SCREENS.LEADERBOARD)}>
          <img src="/images/leaderboard.png" alt="leaderboard" />
        </button>
        <button onClick={() => setRightContent(APP_SCREENS.ONLINE_GAMES)}>
          <img src="/images/gamesonline.png" alt="leaderboard" />
        </button>
      </div>
    </main>
  );
};

export default NavFooter;
