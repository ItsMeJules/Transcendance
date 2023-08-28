import { APP_SCREENS } from "utils/routing/routing";

interface ProfileHeaderProps {
  setLeftContent: (option: number) => void;
}

const ProfileHeader:React.FC<ProfileHeaderProps> = ({ setLeftContent }) => {

	return (
		<div className="header">
      <button onClick={() => setLeftContent(APP_SCREENS.ME_PROFILE)}>
        <img src="/images/game.png" alt="game" />
      </button>
    
		</div>
	);
};

export default ProfileHeader
