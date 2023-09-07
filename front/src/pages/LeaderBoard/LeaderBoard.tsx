import React, { useEffect, useState } from "react";
import { UserData } from "services/User/User";
import UserProfilesList from "./components/UserProfileList";
import { MDBContainer } from 'mdb-react-ui-kit';

import './css/LeaderBoard.scss';
import { useWebsocketContext } from "services/Websocket/Websocket";

const LeaderBoard: React.FC = () => {
  const [userId, setUserId] = useState<string>();
  const [leaderboardData, setLeaderboardData] = useState<any>({});
  const [leaderboardList, setLeaderboardList] = useState<any[]>([]);
  const socket = useWebsocketContext();

  // Socket on + emit
  useEffect(() => {
    socket.game?.on('leaderboard', (data: any) => {
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
    <article className="leaderboard-main-container">

      <header className="leaderboard-header">
        Leaderboard
      </header>

        <MDBContainer className="leaderboard-container">
          <UserProfilesList leaderboardList={leaderboardList} currentUserId={userId} />
        </MDBContainer>

    </article>
  );
}

export default LeaderBoard;
