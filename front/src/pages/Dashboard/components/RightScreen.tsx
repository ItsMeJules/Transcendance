import { Profile, LeaderBoard, Friends, OnlineGames } from 'pages';
import { APP_SCREENS } from 'utils/routing/routing';

interface RightScreenProps {
  rightContent: number;
}

const RightScreen: React.FC<RightScreenProps> = ({ rightContent }) => {
  
  if (rightContent === APP_SCREENS.CHAT) {
    return <Profile />;
  } else if (rightContent === APP_SCREENS.FRIENDS) {
    return <Friends />;
  } else if (rightContent === APP_SCREENS.LEADERBOARD) {
    return <LeaderBoard />;
  } else if (rightContent === APP_SCREENS.ONLINE_GAMES) {
    return <OnlineGames />;
  } else {
    return <div>Default Content</div>; // Fallback content or initial state
  }

};

export default RightScreen;
