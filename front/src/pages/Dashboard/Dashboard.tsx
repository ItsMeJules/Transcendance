import React, { useEffect, useState } from 'react';
import ProfileHeader from './components/ProfileHeader';
import LeftScreen from './components/LeftScreen';
import RightScreen from './components/RightScreen';
import NavFooter from './components/NavFooter';
import './css/Dashboard.scss';

const Dashboard = () => {
  const [leftContent, setLeftContent] = useState<number>(-1);
  const [rightContent, setRightContent] = useState<number>(-1);

  useEffect(() => {
    console.log('rightcontent:', rightContent);
  }, [leftContent]);
  
  return (
    <div className="dashboard-main-container">

      <div className="profile-header-container">
        <ProfileHeader setLeftContent={setLeftContent}/>
      </div>

      <div className="screen-container">
        <div className="left-screen-container">
          <LeftScreen setLeftContent={setLeftContent} leftContent={leftContent} />
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
