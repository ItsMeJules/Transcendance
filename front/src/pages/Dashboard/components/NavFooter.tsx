import { APP_SCREENS } from "utils/routing/routing";

interface LeftNavFooterProps {
  setLeftContent: (option: number) => void;
  setRightContent: (option: number) => void;
}

const NavFooter:React.FC<LeftNavFooterProps> = ({ setLeftContent, setRightContent }) => {

	return (
		<div className="icons">
      <button onClick={() => setLeftContent(APP_SCREENS.PLAY)}>
        <img src="/images/game.png" alt="game" />
      </button>
      <button onClick={() => setLeftContent(APP_SCREENS.SPECTATE)}>
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
		</div>
	);
};

export default NavFooter;
