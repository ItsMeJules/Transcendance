import React, { Component, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import { Home } from './screens/Home';
import { Signin } from './screens/Signin';
import { Signup } from './screens/Signup';
import { Play } from './screens/Play';
import { Route, Routes, NavLink } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import { Leaderboard } from './screens/Leaderboard';
import { UserProfile } from './screens/UserProfile';
import { UserProfileEdit } from './screens/UserProfileEdit';
import { APP_ROUTES } from './utils/constants';
import { Test } from './screens/Test';

function App() {

  // const [token, setToken] = useState();

  // if (!token) {
  //   return <Signin />
  // }

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


      <AppWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={APP_ROUTES.SIGN_IN} element={<Signin />} />
          <Route path={APP_ROUTES.SIGN_UP} element={<Signup />} />
          <Route path={APP_ROUTES.USER_PROFILE} element={<UserProfile />} />
          <Route path={APP_ROUTES.USER_PROFILE_EDIT} element={<UserProfileEdit />} />
          <Route path="/play" element={<Play />} />
          <Route path="/users/all" element={<Leaderboard />} />
          <Route path="/test" element={<Test />}/>
        </Routes>
      </AppWrapper>
    </div>
  );
}

export default App;
