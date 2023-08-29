import { APP_SCREENS } from "utils/routing/routing";

interface ProfileHeaderProps {
  setLeftContent: (option: number) => void;
}

const ProfileHeader:React.FC<ProfileHeaderProps> = ({ setLeftContent }) => {

	return (
		<div className="icons">
			<div className="pic">
				<button onClick={() => setLeftContent(APP_SCREENS.ME_PROFILE)}>
					<img src="/images/game.png" alt="game" />
				</button>
			</div>
			<div className="stats">
				
			</div>
			<div className="settings">
				<button onClick={() => setLeftContent(APP_SCREENS.ME_PROFILE)}>
					<img src="/images/game.png" alt="game" />
				</button>
			</div>
		</div>
	);
};

export default ProfileHeader
