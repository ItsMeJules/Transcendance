import React from 'react';
import { Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import 'App.css';
import Websocket from 'services/Websocket/Websocket';
import { APP_ROUTES } from 'utils/routing/routing';
import LayoutWrapper from 'layout/LayoutWrapper';
import { Home, Signin, Signup, Dashboard, Profile } from 'pages';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={APP_ROUTES.SIGN_IN} element={<LayoutWrapper><Signin /></LayoutWrapper>} />
        <Route path={APP_ROUTES.SIGN_UP} element={<LayoutWrapper><Signup /></LayoutWrapper>} />
        <Route path={APP_ROUTES.DASHBOARD} element={<LayoutWrapper><Dashboard /></LayoutWrapper>} />
      </Routes>
    </ >
  );
}

export default App;