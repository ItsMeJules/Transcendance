import React, { useState } from 'react';
import ProfileHeader from './components/ProfileHeader';
import LeftScreen from './components/LeftScreen';
import RightScreen from './components/RightScreen';
import LeftNavFooter from './components/LeftNavFooter';
import RightNavFooter from './components/RightNavFooter';
import './css/Dashboard.css';

const Dashboard = () => {
  const [leftContent, setLeftContent] = useState('');
  const [rightContent, setRightContent] = useState('');

  const handleOptionSelect = (option: string) => {
    
    if (option === 'game') {
      setLeftContent('game');
    } else if (option === 'spectate') {
      setLeftContent('spectate');
    } else if (option === 'chat') {
      setRightContent('chat');
    } else if (option === 'friends') {
      setRightContent('friends');
    } else if (option === 'leaderboard') {
      setRightContent('leaderboard');
    }
  };

  return (
    <div className="dashboard">

      <ProfileHeader />

      <div className="screen-container">

        <div className="screen left-screen">
          <LeftScreen content={leftContent} />
        </div>
        <div className="screen right-screen">
          <RightScreen content={rightContent} />
        </div>

      </div>

      <div className="nav-footer-container">
        <LeftNavFooter onSelectOption={handleOptionSelect} />
        <RightNavFooter onSelectOption={handleOptionSelect} />
      </div>

    </div>
  );
};

export default Dashboard;
