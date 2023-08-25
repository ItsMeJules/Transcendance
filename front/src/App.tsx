import React from 'react';
import { Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"

import 'App.css';
import { APP_ROUTES } from 'utils/routing/routing';
import LayoutWrapper from 'layout/LayoutWrapper';
import { Home, Signin, Signup, Profile, ProfileEdit, ProfileFriends, LeaderBoard, Play, Auth2factor } from 'pages';

const App: React.FC = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <LayoutWrapper>
          {/* <Route path={APP_ROUTES.SIGN_IN} element={<Signin />} />
          <Route path={APP_ROUTES.SIGN_UP} element={<Signup />} />
          <Route path={APP_ROUTES.USER_PROFILE} element={<Profile />} />
          <Route path={APP_ROUTES.USER_PROFILE_EDIT} element={<ProfileEdit />} />
          <Route path={APP_ROUTES.USER_FRIENDS} element={<ProfileFriends />} />
          <Route path={APP_ROUTES.LEADERBOARD} element={<LeaderBoard />} />
          <Route path={APP_ROUTES.PLAY} element={<Play />} />
          <Route path={APP_ROUTES.AUTH_2FA} element={<Auth2factor />} /> */}
        </LayoutWrapper>
      </Routes>
    </ >
  );
}

export default App;
