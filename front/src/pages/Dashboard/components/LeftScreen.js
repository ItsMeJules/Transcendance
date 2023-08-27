import { Home, Play } from 'pages';

const LeftScreen = ({ content }) => {
  
  if (content === 'game') {
    return <Play />;
  } else if (content === 'spectate') {
    return <Home />;
  } else {
    return <div>Default Content</div>; // Fallback content or initial state
  }

};

export default LeftScreen;
