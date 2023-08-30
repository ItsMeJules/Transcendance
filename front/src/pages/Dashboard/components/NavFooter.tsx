import { APP_SCREENS } from "utils/routing/routing";

interface LeftNavFooterProps {
  setRightContent: (option: number) => void;
}

const NavFooter: React.FC<LeftNavFooterProps> = ({ setRightContent }) => {

  const handleMatchMakingClick = (() => { });
  const handleSpectateClick = (() => { })

  return (
    <main className="nav-footer-container">
      <div className="icons">
        <button onClick={handleMatchMakingClick}>
          <img src="/images/game.png" alt="game" />
        </button>
        <button onClick={handleSpectateClick}>
          <img src="/images/spectate.png" alt="spectate" />
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
