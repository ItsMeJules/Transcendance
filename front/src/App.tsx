import React from 'react';
import { Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"


import 'App.css';
import Websocket from 'services/Websocket/Websocket';
import { APP_ROUTES } from 'utils/routing/routing';
import LayoutWrapper from 'layout/LayoutWrapper';
import { Home, Signin, Signup, Dashboard } from 'pages';

const App: React.FC = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      <LayoutWrapper>
        <Routes>
          <Route path={APP_ROUTES.SIGN_IN} element={<Signin />} />
          <Route path={APP_ROUTES.SIGN_UP} element={<Signup />} />
        </Routes>
      </LayoutWrapper>

      <Websocket>
        <LayoutWrapper>
          <Routes>
            <Route path={'/dashboard'} element={<Dashboard />} />
          </Routes>
        </LayoutWrapper>
      </Websocket>
    </ >
  );
}

export default App;
