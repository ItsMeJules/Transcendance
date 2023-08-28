import { APP_SCREENS } from "utils/routing/routing";

interface RightNavFooterProps {
  setRightContent: (option: number) => void;
}

const RightNavFooter:React.FC<RightNavFooterProps> = ({ setRightContent }) => {

	return (
		<div className="footer right-nav-footer">
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

export default RightNavFooter;
