import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from "utils/redux/Store";

import "bootstrap/dist/css/bootstrap.min.css"
import 'App.css';
import Websocket from 'services/Websocket/Websocket';
import { APP_ROUTES } from 'utils/routing/routing';
import LayoutWrapper from 'layout/LayoutWrapper';
import { Home, Signin, Signup, Dashboard, ChatBox } from 'pages';

const App: React.FC = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Websocket>
            <LayoutWrapper>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path={APP_ROUTES.SIGN_IN} element={<LayoutWrapper><Signin /></LayoutWrapper>} />
                <Route path={APP_ROUTES.SIGN_UP} element={<LayoutWrapper><Signup /></LayoutWrapper>} />
                  <Route path={'/dashboard'} element={<Dashboard />} />
                  <Route path={'/testchat'} element={<ChatBox />} />
              </Routes>
            </LayoutWrapper>
          </Websocket>
        </PersistGate>
      </Provider>
    </ >
  );
};

export default App;
