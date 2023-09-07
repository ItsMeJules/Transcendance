import { ChatBox, LeaderBoard, Friends, OnlineGames, AllUsers } from 'pages';
import { useAppSelector } from 'utils/redux/Store';
import { APP_SCREENS } from 'utils/routing/routing';

const RightScreen: React.FC = () => {

  const { rightScreenState } = useAppSelector(store => store.rightScreen)

  if (rightScreenState === APP_SCREENS.ALL_USERS) {
    return <AllUsers />;
  } else if (rightScreenState === APP_SCREENS.CHAT) {
    return <ChatBox />;
  } else if (rightScreenState === APP_SCREENS.FRIENDS) {
    return <Friends />;
  } else if (rightScreenState === APP_SCREENS.LEADERBOARD) {
    return <LeaderBoard />;
  } else if (rightScreenState === APP_SCREENS.ONLINE_GAMES) {
    return <OnlineGames />;
  } else {
    return <div></div>;
  }

};

export default RightScreen;
