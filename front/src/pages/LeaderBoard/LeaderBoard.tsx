import React, { useEffect, useState } from "react";
import axios, { } from "axios";
import { useNavigate } from "react-router-dom";

import { API_ROUTES, APP_ROUTES } from "utils/routing/routing";
import ToastError from "layout/ToastError/ToastError";
import User from "services/User/User";
import { UserArray } from "services/User/UserArray";
import { UserData } from "services/User/User";

import LeaderBoardHeader from "./components/LeaderBoardHeader";
import UserProfilesList from "./components/UserProfileList";
import LeaderBoardContainer from "./components/LeaderBoardContainer"
import { MDBContainer, MDBCard } from 'mdb-react-ui-kit';

import './css/LeaderBoard.scss';
import { useWebsocketContext } from "services/Websocket/Websocket";

const LeaderBoard: React.FC = () => {
  const [userId, setUserId] = useState<string>();
  const [leaderboardData, setLeaderboardData] = useState<any>({});
  const [leaderboardList, setLeaderboardList] = useState<any[]>([]);
  const [errMsg, setErrMsg] = useState('');
  const [users, setUsers] = useState<UserArray>([]);
  const socket = useWebsocketContext();
  const history = useNavigate();
  // const userDataStore = useSelector((state: RootState) => state.user);

  const resetErrMsg = () => {
    setErrMsg(''); // Reset errMsg to an empty string
  };

  // Socket on + emit
  useEffect(() => {
    socket.game?.on('leaderboard', (data: any) => {
      console.log('Leadbd:', data);
      setUserId(data.userId);
      setLeaderboardData(data.leaderboard);
    });
    socket.game?.emit('leaderboard', { action: 'status' });
    return () => {
      socket.game?.off('leaderboard');
    };
  }, [socket.game]);

  // Set leaderboard data
  useEffect(() => {
    const tmpUsersList = (Object.entries(leaderboardData) as Array<[string, UserData]>).map(
      ([userId, userData]: [string, UserData]) => ({
        id: userData.id,
        profilePicture: userData.profilePicture,
        username: userData.username,
        isOnline: userData.isOnline,
        userPoints: userData.userPoints,
        userLevel: userData.userLevel,
      }));
    setLeaderboardList(tmpUsersList);
  }, [leaderboardData])

  return (
    <main className="right-screen-container">
      <article className="leaderboard-main-container">

        <header className="leaderboard-header">
          Leaderboard
        </header>

        <MDBContainer className="leaderboard-container">
          <UserProfilesList leaderboardList={leaderboardList} currentUserId={userId} />
        </MDBContainer>

      </article>
    </main>
  );
}

export default LeaderBoard;
