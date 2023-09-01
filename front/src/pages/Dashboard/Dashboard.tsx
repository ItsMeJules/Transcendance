import React, { useEffect, useState } from 'react';
import ProfileHeader from './components/ProfileHeader';
import RightScreen from './components/RightScreen';
import NavFooter from './components/NavFooter';
import './css/Dashboard.scss';
import { Route, Routes, useLocation } from 'react-router-dom';
import { APP_ROUTES, APP_SCREENS } from 'utils/routing/routing';
import Profile from 'pages/Profile/Profile';
import Spectate from 'pages/Spectate/Spectate';
import Play from 'pages/Play/Play';
import ProfileEdit from 'pages/ProfileEdit/ProfileEdit';
import GenericUserProfile from 'pages/Profile/GenericUserProfile';
import JoinGame from 'pages/JoinGame/JoinGame';
import Websocket from 'services/Websocket/Websocket';

const Dashboard = () => {
  const [rightContent, setRightContent] = useState<number>(APP_SCREENS.LEADERBOARD);
  const location = useLocation();

  useEffect(() => {
    // console.log('leftcntent:', rightContent);
  }, [rightContent]);

  return (
    <main className="dashboard-main-container">


      <ProfileHeader />

      <main className="screen-container">

        <Websocket key={location.pathname}>
          <article className="left-screen-container">
            <Routes>
              <Route path={APP_ROUTES.USER_PROFILE} element={<Profile />} />
              <Route path={APP_ROUTES.USER_PROFILE_EDIT} element={<ProfileEdit />} />
              <Route path={APP_ROUTES.GENERIC_USER_PROFILE + ":id"} element={React.createElement(GenericUserProfile)} />
              <Route path={APP_ROUTES.MATCHMAKING} element={<JoinGame />} />
              <Route path={APP_ROUTES.PLAY} element={<Play />} />
              <Route path={APP_ROUTES.SPECTATE} element={<Spectate />} />
            </Routes>
          </article>
        </Websocket>

        <Websocket key={rightContent}>
          <article className="right-screen-container">
            <RightScreen rightContent={rightContent} />
          </article>
        </Websocket>

      </main>

      <NavFooter setRightContent={setRightContent} />


    </main>
  );
};

export default Dashboard;
