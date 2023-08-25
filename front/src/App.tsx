import React, { } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import Home from './pages/Home/Home';
import { Signin } from './pages/Login/Signin';
import { Signup } from './pages/Login/Signup';
import { Route, Routes } from 'react-router-dom';
import LayoutWrapper from './layout/LayoutWrapper';
import { APP_ROUTES } from './utils/constants';
import { UserProfile } from './pages/UserProfile/UserProfile';
import { UserProfileEdit } from './pages/UserProfile/UserProfileEdit';
import { Test } from './pages/Test';
import LeaderBoard from './pages/LeaderBoard/LeaderBoard';
import UserFriends from './pages/Friends/Friends';
import { Play } from './pages/Play/Play';
import { TwoFa } from "./pages/2fa";

const App: React.FC = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <LayoutWrapper>
          <Route path={APP_ROUTES.SIGN_IN} element={<Signin />} />
          <Route path={APP_ROUTES.SIGN_UP} element={<Signup />} />
          <Route path={APP_ROUTES.USER_PROFILE} element={<UserProfile />} />
          <Route path={APP_ROUTES.USER_PROFILE_EDIT} element={<UserProfileEdit />} />
          <Route path={APP_ROUTES.USER_FRIENDS} element={<UserFriends />} />
          <Route path={APP_ROUTES.LEADERBOARD} element={<LeaderBoard />} />
          <Route path="/test" element={<Test />} />
          <Route path="/play" element={<Play />} />
          {/* <Route path="/playback" element={<PlayBack />} /> */}
          <Route path={APP_ROUTES.LOG_2FA} element={<TwoFa />} />
        </LayoutWrapper>
      </Routes>
    </ >
  );
}

export default App;
