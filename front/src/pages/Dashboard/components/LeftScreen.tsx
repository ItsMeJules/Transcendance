import { Play, Profile, Spectate } from 'pages';
import { APP_SCREENS } from 'utils/routing/routing';

interface LeftScreenProps {
  leftContent: number;
}

const LeftScreen: React.FC<LeftScreenProps> = ({ leftContent }) => {
  
  if (leftContent === APP_SCREENS.PLAY) {
    return <Play />;
  } else if (leftContent === APP_SCREENS.SPECTATE) {
    return <Spectate />;
  } else if (leftContent === APP_SCREENS.ME_PROFILE) {
    return <Profile />;
  } else {
    return <div></div>; // Fallback content or initial state
  }

};

export default LeftScreen;
