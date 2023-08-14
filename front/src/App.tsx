import React, { } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import './Screens/UserProfile/css/ProgressBar.scss'
import './Screens/Login/css/LoginButtons.css'
import './Screens/Login/css/Signin.scss'
import './Components/css/Toast.scss'
import './Components/css/ToastNotif.scss'
import './Screens/UserProfile/css/UserProfile.scss'
import './Screens/LeaderBoard/css/LeaderBoard.scss'
import './Screens/Friends/css/friends.scss'
import './Screens/JoinGame/css/loading.css'
import './Screens/Play/css/play.scss'
import { Home } from './Screens/Home/Home';
import { Signin } from './Screens/Login/Signin';
import { Signup } from './Screens/Login/Signup';
import { Route, Routes, useLocation } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import { UserProfile } from './Screens/UserProfile/UserProfile';
import { UserProfileEdit } from './Screens/UserProfileEdit/UserProfileEdit';
import { APP_ROUTES } from './Utils/constants';
import { Test } from './Screens/Test';
import LeaderBoard from './Screens/LeaderBoard/LeaderBoard';
import GenericUserProfile from './Screens/UserProfile/GenericUserProfile';
import UserFriends from './Screens/Friends/Friends';
import Websocket from './Wrappers/Websocket';
import { Play } from './Screens/Play/Play';
import { TwoFa } from "./screens/2fa";
import { render } from "@testing-library/react";

const App: React.FC = () => {

  return (
    <div>
      {/* <header className='flex justify-between items-center mb-5'>
        <BsFillBalloonHeartFill style={{color: 'red', fontSize: '50px'}}/>
        <nav>
          <NavLink className='mr-3' style={({ isActive }) => ({fontWeight: isActive ? 'bold' : 'normal'})} to='/'>Accueil</NavLink>
          <NavLink className='mr-3' style={({ isActive }) => ({fontWeight: isActive ? 'bold' : 'normal'})} to='/ressources'>Ressources</NavLink>
          <NavLink className='mr-3' style={({ isActive }) => ({fontWeight: isActive ? 'bold' : 'normal'})} to='/contact'>Contact</NavLink>
        </nav>
      </header> */}

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
          </Routes>
          <Routes>
            <Route path={APP_ROUTES.LOG_2FA} element={<TwoFa />} />
          </Routes>
        </AppWrapper>
      </Websocket>
    </div >
  );
}

export default App;
