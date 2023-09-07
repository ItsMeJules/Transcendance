import JoinGame from 'pages/JoinGame/JoinGame';
import NotFoundPageDashboard from 'pages/NotFoundPage/NotFoundDashboard';
import Play from 'pages/Play/Play';
import GenericUserProfile from 'pages/Profile/GenericUserProfile';
import Profile from 'pages/Profile/Profile';
import ProfileEdit from 'pages/ProfileEdit/ProfileEdit';
import ProfileGameHistory from 'pages/ProfileGameHistory/ProfileGameHistory';
import Spectate from 'pages/Spectate/Spectate';
import { Route, Routes } from 'react-router-dom';
import Websocket from 'services/Websocket/Websocket';
import { APP_ROUTES } from 'utils/routing/routing';
import NavFooter from './components/NavFooter';
import ProfileHeader from './components/ProfileHeader';
import RightScreen from './components/RightScreen';
import './css/Dashboard.scss';

const Dashboard = () => {
  return (
    <Websocket>
      <main className="dashboard-main-container">

        <ProfileHeader />

        <article className="screen-container">
          <div className="left-screen-container">

            <Routes>
              <Route index element={<NotFoundPageDashboard />} />
              <Route path={APP_ROUTES.USER_PROFILE} element={<Profile />} />
              <Route path={APP_ROUTES.USER_PROFILE_EDIT} element={<ProfileEdit />} />
              <Route path={APP_ROUTES.GENERIC_USER_PROFILE + ":id"} element={<GenericUserProfile />} />
              <Route path={APP_ROUTES.GENERIC_USER_PROFILE + ":id" + APP_ROUTES.GAME_HISTORY_SUFFIX} element={<ProfileGameHistory />} />
              <Route path={APP_ROUTES.MATCHMAKING} element={<JoinGame />} />
              <Route path={APP_ROUTES.PLAY} element={<Play />} />
              <Route path={APP_ROUTES.SPECTATE} element={<Spectate />} />
              <Route path="*" element={<NotFoundPageDashboard />} />
            </Routes>
          </div>

          <div className="right-screen-container">
            <RightScreen />
          </div>
        </article>

        <NavFooter />


      </main>
    </Websocket>
  );
};

export default Dashboard;
