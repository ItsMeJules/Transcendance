import { APP_SCREENS } from "utils/routing/routing";

interface LeftNavFooterProps {
  setLeftContent: (option: number) => void;
}

const LeftNavFooter:React.FC<LeftNavFooterProps> = ({ setLeftContent }) => {

	return (
		<div className="footer left-nav-footer">
      <button onClick={() => setLeftContent(APP_SCREENS.MATCHMAKING)}>
        <img src="/images/game.png" alt="game" />
      </button>
      <button onClick={() => setLeftContent(APP_SCREENS.SPECTATE)}>
        <img src="/images/spectate.png" alt="spectate" />
      </button>
		</div>
	);
};

export default LeftNavFooter;
