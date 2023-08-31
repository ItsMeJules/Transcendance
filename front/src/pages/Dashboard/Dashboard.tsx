import React, { useEffect, useState } from 'react';
import ProfileHeader from './components/ProfileHeader';
import LeftScreen from './components/LeftScreen';
import RightScreen from './components/RightScreen';
import NavFooter from './components/NavFooter';
import './css/Dashboard.scss';
import { Route, Routes, useLocation } from 'react-router-dom';
import { APP_ROUTES } from 'utils/routing/routing';
import UserProfile from 'pages/Friends/Components/UserProfile';
import Profile from 'pages/Profile/Profile';
import Spectate from 'pages/Spectate/Spectate';
import Play from 'pages/Play/Play';
import ProfileEdit from 'pages/ProfileEdit/ProfileEdit';
import GenericUserProfile from 'pages/Profile/GenericUserProfile';
import JoinGame from 'pages/JoinGame/JoinGame';
import Websocket from 'services/Websocket/Websocket';

const Dashboard = () => {
  const [rightContent, setRightContent] = useState<number>(-1);
  const location = useLocation();

  useEffect(() => {
    // console.log('leftcntent:', rightContent);
  }, [rightContent]);

  return (
    <Websocket key={location.pathname}>
      <div className="dashboard-main-container">

        <ProfileHeader />

        <article className="screen-container">

          <Routes>
            <Route path={APP_ROUTES.USER_PROFILE} element={<Profile />} />
            <Route path={APP_ROUTES.USER_PROFILE_EDIT} element={<ProfileEdit />} />
            <Route path={APP_ROUTES.GENERIC_USER_PROFILE + ":id"} element={React.createElement(GenericUserProfile)} />
            <Route path={APP_ROUTES.MATCHMAKING} element={<JoinGame />} />
            <Route path={APP_ROUTES.PLAY} element={<Play />} />
            <Route path={APP_ROUTES.SPECTATE} element={<Spectate />} />
          </Routes>

          <div className="right-screen-container">
            <RightScreen rightContent={rightContent} />
          </div>
        </article>

        <NavFooter setRightContent={setRightContent} />

      </div>
    </Websocket>
  );
};

export default Dashboard;
