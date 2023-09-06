import { Play, Profile, JoinGame } from 'pages';
import { APP_SCREENS } from 'utils/routing/routing';

interface LeftScreenProps {
  leftContent: number;
  setLeftContent: (content: number) => void;
}

const LeftScreen: React.FC<LeftScreenProps> = ({ leftContent, setLeftContent }) => {
  
  if (leftContent === APP_SCREENS.MATCHMAKING) {
    return <JoinGame/>;
  } else if (leftContent === APP_SCREENS.PLAY) {
    return <Play />;
  } else if (leftContent === APP_SCREENS.ME_PROFILE) {
    return <Profile />;
  } else {
    return <div></div>; // Fallback content or initial state
  }
};

export default LeftScreen;
