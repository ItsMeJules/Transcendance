import { Route, Routes, useNavigate } from 'react-router-dom';
import ProfileGameHistory from 'pages/ProfileGameHistory/ProfileGameHistory';
import { useAxios } from 'utils/axiosConfig/axiosConfig';
import { useEffect, useState } from "react";
import ProfileHeader from "./components/ProfileHeader";
import RightScreen from "./components/RightScreen";
import NavFooter from "./components/NavFooter";
import "./css/Dashboard.scss";
import { APP_ROUTES, APP_SCREENS } from "utils/routing/routing";
import Profile from "pages/Profile/Profile";
import Spectate from "pages/Spectate/Spectate";
import Play from "pages/Play/Play";
import ProfileEdit from "pages/ProfileEdit/ProfileEdit";
import GenericUserProfile from "pages/Profile/GenericUserProfile";
import JoinGame from "pages/JoinGame/JoinGame";
import Websocket from "services/Websocket/Websocket";
import NotFoundPageDashboard from "pages/NotFoundPage/NotFoundDashboard";
import RedirectPlay from "pages/Redirections/RedirectPlay";
import { API_ROUTES } from 'utils/routing/routing';

const Dashboard = () => {
  const [rightContent, setRightContent] = useState<number>(APP_SCREENS.CHAT);
  const [noGame, setNoGame] = useState(false);
  const customAxiosInstance = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await customAxiosInstance.get(API_ROUTES.HOME_CHECK_TOKEN,
          {
            withCredentials: true
          })
        if (response.data.tokenState === 'NO_TOKEN')
          return navigate(APP_ROUTES.SIGN_IN + '?error=unauthorized');
      } catch (error) { };
    }
    verifyToken();
  }, [])

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
              <Route
                path={APP_ROUTES.SPECTATE}
                element={<Spectate noGame={noGame} setNoGame={setNoGame} />}
              />
              <Route path="*" element={<NotFoundPageDashboard />} />
            </Routes>
          </div>

          <div className="right-screen-container">
            <RightScreen rightContent={rightContent} noGame={noGame} setNoGame={setNoGame} />
          </div>
        </article>

        <NavFooter setRightContent={setRightContent} />
      </main>
    </Websocket>
  );
};

export default Dashboard;
