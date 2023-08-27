import { Profile, LeaderBoard } from 'pages';

const RightScreen = ({ content }) => {
  
  if (content === 'chat') {
    return <Profile />;
  } else if (content === 'friends') {
    return <LeaderBoard />;
  } else if (content === 'leaderboard') {
    return <LeaderBoard />;
  } else {
    return <div>Default Content</div>; // Fallback content or initial state
  }

};

export default RightScreen;
