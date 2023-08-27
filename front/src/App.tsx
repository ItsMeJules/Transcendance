import React from 'react';
import { Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"

import 'App.css';
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
          <Route path={'/dashboard'} element={<Dashboard />} />
        </Routes>
      </LayoutWrapper>
    </ >
  );
}

export default App;
