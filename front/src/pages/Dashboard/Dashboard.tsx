import React, { useState } from 'react';
import ProfileHeader from './components/ProfileHeader';
import LeftScreen from './components/LeftScreen';
import RightScreen from './components/RightScreen';
import LeftNavFooter from './components/LeftNavFooter';
import RightNavFooter from './components/RightNavFooter';
import './css/Dashboard.scss';
import { APP_SCREENS } from 'utils/routing/routing';

const Dashboard = () => {
  const [leftContent, setLeftContent] = useState<number>(APP_SCREENS.ME_PROFILE);
  const [rightContent, setRightContent] = useState<number>(-1);

  return (
    <div className="dashboard-main-container">

      <ProfileHeader setLeftContent={setLeftContent}/>

      <div className="screen-container">

        <div className="screen left-screen">
          <LeftScreen leftContent={leftContent} />
        </div>
        <div className="screen right-screen">
          <RightScreen rightContent={rightContent} />
        </div>

      </div>

      <div className="nav-footer-container">
        <LeftNavFooter setLeftContent={setLeftContent} />
        <RightNavFooter setRightContent={setRightContent} />
      </div>

    </div>
  );
};

export default Dashboard;
