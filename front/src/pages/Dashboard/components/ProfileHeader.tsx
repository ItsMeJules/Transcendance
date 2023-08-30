import { useNavigate } from "react-router-dom";
import { APP_ROUTES, APP_SCREENS } from "utils/routing/routing";

const ProfileHeader = () => {
  const history = useNavigate();

  const handleProfileClick = (() => {
    history(APP_ROUTES.USER_PROFILE)
  });

  return (
    <main className="profile-header-container">

      <div className="icons">
        <div className="pic">
          <button onClick={handleProfileClick}>
            <img src="/images/game.png" alt="game" />
          </button>
        </div>

        <div className="stats">

        </div>

        <div className="settings">
          {/* <button onClick={() => setLeftContent(APP_SCREENS.ME_PROFILE)}> */}
          <img src="/images/settings.png" alt="game" />
          {/* </button> */}
        </div>
      </div>
      
    </main>
  );
};

export default ProfileHeader
