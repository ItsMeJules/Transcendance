import { APP_SCREENS } from "utils/routing/routing";

interface ProfileHeaderProps {
  setLeftContent: (option: number) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ setLeftContent }) => {

  return (
    <header className="header-main-container">
      <header className="header-sub-container-centered">
        <button onClick={() => setLeftContent(APP_SCREENS.ME_PROFILE)}>
          <img src="/images/game.png" alt="game" />
        </button>
      </header>
    </header>
  );
};

export default ProfileHeader
