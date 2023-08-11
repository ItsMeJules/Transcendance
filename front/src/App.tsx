import React, { Component, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./css/ProgressBar.scss";
import "./css/LoginButtons.css";
import "./css/Signin.scss";
import "./css/Toast.scss";
import "./css/ToastNotif.scss";
import "./css/UserProfile.scss";
import "./css/2faButton.scss";
import "./LeaderBoard/LeaderBoard";
import { Home } from "./screens/Home";
import { Signin } from "./screens/Signin";
import { Signup } from "./screens/Signup";
import { Play } from "./screens/Play";
import { Route, Routes, NavLink } from "react-router-dom";
import AppWrapper from "./AppWrapper";
import { UserProfile } from "./screens/UserProfile";
import { UserProfileEdit } from "./screens/UserProfileEdit";
import { APP_ROUTES } from "./utils/constants";
import { Test } from "./screens/Test";
import LeaderBoard from "./LeaderBoard/LeaderBoard";
import GenericUserProfile from "./UserProfile/GenericUserProfile";
import { render } from "@testing-library/react";
import UserFriends from "./UserProfile/UserFriends";
import { TwoFa } from "./screens/2fa";

function App() {
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
          <Route path="/play" element={<Play />}/>
          {/* <Route path="/users/all" element={<Leaderboard />} /> */}
          <Route
            path={APP_ROUTES.USER_PROFILE_EDIT}
            element={<UserProfileEdit />}
          />
          <Route path={APP_ROUTES.USER_FRIENDS} element={<UserFriends />} />
          <Route path={APP_ROUTES.LEADERBOARD} element={<LeaderBoard />} />
          <Route
            path={APP_ROUTES.GENERIC_USER_PROFILE + ":id"}
            element={React.createElement(GenericUserProfile)}
          />
          <Route path="/test" element={<Test />} />
        </Routes>
      </AppWrapper>
      <Routes>
        <Route path={APP_ROUTES.LOG_2FA} element={<TwoFa />} />
      </Routes>
    </div>
  );
}

export default App;
