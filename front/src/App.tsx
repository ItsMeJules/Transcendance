import React from "react";
import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "utils/redux/Store";
import "bootstrap/dist/css/bootstrap.min.css";
import "App.css";
import { APP_ROUTES } from "utils/routing/routing";
import LayoutWrapper from "layout/LayoutWrapper";
import { Home, Signin, Signup, Dashboard, NotFoundPage, Auth2factor } from "pages";
import ErrorBoundary from "services/ErrorBoundary/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RedirectPlay from "pages/Redirections/RedirectPlay";

const App: React.FC = () => {
  return (
    <>
      <ErrorBoundary>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <ToastContainer />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path={APP_ROUTES.SIGN_IN}
                element={
                  <LayoutWrapper>
                    <Signin />
                  </LayoutWrapper>
                }
              />
              <Route
                path={APP_ROUTES.SIGN_UP}
                element={
                  <LayoutWrapper>
                    <Signup />
                  </LayoutWrapper>
                }
              />
              <Route
                path={APP_ROUTES.DASHBOARD}
                element={
                  <LayoutWrapper>
                    <Dashboard />
                  </LayoutWrapper>
                }
              />
              <Route
                path={APP_ROUTES.AUTH_2FA}
                element={
                  <LayoutWrapper>
                    <Auth2factor />
                  </LayoutWrapper>
                }
              />
              <Route path={APP_ROUTES.REDIRECT_PLAY} element={<RedirectPlay />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </>
  );
};

export default App;
