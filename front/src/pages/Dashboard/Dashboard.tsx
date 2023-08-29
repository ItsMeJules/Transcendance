import React, { useState } from 'react';
import ProfileHeader from './components/ProfileHeader';
import LeftScreen from './components/LeftScreen';
import RightScreen from './components/RightScreen';
import NavFooter from './components/NavFooter';
import './css/Dashboard.scss';

const Dashboard = () => {
  const [leftContent, setLeftContent] = useState<number>(-1);
  const [rightContent, setRightContent] = useState<number>(-1);

  return (
    <div className="dashboard-container">

      <div className="profile-header-container">
        <ProfileHeader setLeftContent={setLeftContent}/>
      </div>

      <div className="screen-container">
        <div className="left-screen-container">
          <LeftScreen leftContent={leftContent} />
        </div>
        <div className="right-screen-container">
          <RightScreen rightContent={rightContent} />
        </div>
      </div>

      <div className="nav-footer-container">
        <NavFooter setLeftContent={setLeftContent} setRightContent={setRightContent}/>
      </div>

    </div>
  );
};

export default Dashboard;
