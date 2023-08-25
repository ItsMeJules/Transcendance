import React, { } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import './pages/UserProfile/css/ProgressBar.scss'
import './pages/Login/css/LoginButtons.css'
import './pages/Login/css/Signin.scss'
import './Components/css/Toast.scss'
import './Components/css/ToastNotif.scss'
import './Components/css/GlobalNavDropdown.scss'
import './pages/UserProfile/css/UserProfile.scss'
import './pages/LeaderBoard/css/LeaderBoard.scss'
import './pages/Friends/css/friends.scss'
import './pages/JoinGame/css/loading.css'
import './pages/Play/css/play.scss'
import './css/2faButton.scss'
import './minigame/components/GameStyles.css'
import Home from './pages/Home/Home';
import { Signin } from './pages/Login/Signin';
import { Signup } from './pages/Login/Signup';
import { Route, Routes, useLocation } from 'react-router-dom';
import AppWrapper from './layout/AppWrapper';
import { UserProfile } from './pages/UserProfile/UserProfile';
import { UserProfileEdit } from './pages/UserProfile/UserProfileEdit';
import { APP_ROUTES } from './utils/constants';
import { Test } from './pages/Test';
import LeaderBoard from './pages/LeaderBoard/LeaderBoard';
import GenericUserProfile from './pages/UserProfile/GenericUserProfile';
import UserFriends from './pages/Friends/Friends';
import Websocket from './services/Websocket';
import { Play } from './pages/Play/Play';
import { TwoFa } from "./pages/2fa";

const App: React.FC = () => {

  return (
    <div>
      <Websocket>
        <AppWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path={APP_ROUTES.SIGN_IN} element={<Signin />} />
            <Route path={APP_ROUTES.SIGN_UP} element={<Signup />} />
            <Route path={APP_ROUTES.USER_PROFILE} element={<UserProfile />} />
            <Route path={APP_ROUTES.USER_PROFILE_EDIT} element={<UserProfileEdit />} />
            <Route path={APP_ROUTES.USER_FRIENDS} element={<UserFriends />} />
            <Route path={APP_ROUTES.LEADERBOARD} element={<LeaderBoard />} />
            <Route path={APP_ROUTES.GENERIC_USER_PROFILE + ":id"} element={React.createElement(GenericUserProfile)} />
            <Route path="/test" element={<Test />} />
            <Route path="/play" element={<Play />} />
            {/* <Route path="/playback" element={<PlayBack />} /> */}
            <Route path={APP_ROUTES.LOG_2FA} element={<TwoFa />} />
          </Routes>
        </AppWrapper>
      </Websocket>
    </div >
  );
}

export default App;
