import React, { useEffect, useState } from 'react';
import ProfileHeader from './components/ProfileHeader';
import LeftScreen from './components/LeftScreen';
import RightScreen from './components/RightScreen';
import NavFooter from './components/NavFooter';
import './css/Dashboard.scss';
import { Route, Routes } from 'react-router-dom';
import { APP_ROUTES } from 'utils/routing/routing';
import UserProfile from 'pages/Friends/Components/UserProfile';
import Profile from 'pages/Profile/Profile';

const Dashboard = () => {
  const [rightContent, setRightContent] = useState<number>(-1);

  useEffect(() => {
    console.log('leftcntent:', rightContent);
  }, [rightContent]);

  return (
    <div className="dashboard-main-container">

      <ProfileHeader />

      <article className="screen-container">
      <Routes>
        <Route path={APP_ROUTES.USER_PROFILE} element={<Profile />} />
      </Routes>

      <div className="right-screen-container">
        <RightScreen rightContent={rightContent} />
      </div>
      </article>

      <NavFooter setRightContent={setRightContent} />

    </div>
  );
};

export default Dashboard;
