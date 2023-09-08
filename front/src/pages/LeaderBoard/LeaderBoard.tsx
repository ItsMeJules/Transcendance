import React, { useEffect, useState } from "react";
import { UserData } from "services/User/User";
import UserProfilesList from "./components/UserProfileList";
import { MDBContainer } from "mdb-react-ui-kit";

import "./css/LeaderBoard.scss";
import { useWebsocketContext } from "services/Websocket/Websocket";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import { toast } from "react-toastify";
import PayloadAction from "pages/ChatBox/models/PayloadSocket";

const LeaderBoard: React.FC = () => {
  const [userId, setUserId] = useState<string>();
  const [leaderboardData, setLeaderboardData] = useState<any>({});
  const [leaderboardList, setLeaderboardList] = useState<any[]>([]);
  const socket = useWebsocketContext();
  const [socketData, setSocketData] = useState("");
  const navigate = useNavigate();

  // Socket on + emit
  useEffect(() => {
    if (socketData === "") return;
    const dataString = JSON.stringify(socketData);
    const dataJSON = JSON.parse(dataString);
    localStorage.setItem("gameData", JSON.stringify(dataJSON.game));
    localStorage.setItem("player1", JSON.stringify(dataJSON.player1));
    localStorage.setItem("player2", JSON.stringify(dataJSON.player2));
    localStorage.setItem("gameChannel", JSON.stringify(dataJSON.gameChannel));
    if (window.location.pathname === APP_ROUTES.PLAY_ABSOLUTE) {
      navigate(APP_ROUTES.REDIRECT_PLAY);
    } else {
      navigate(APP_ROUTES.PLAY_ABSOLUTE);
    }
  }, [socketData]);

  const displayAcknowledgements = (payload: any) => {
    socket.chat?.on("answerInvitation", (payload2: any) => {
      if (payload2.message === "yes") {
        socket.chat?.off("answerInvitation"); // Remove the listener
        setSocketData(payload2);
      } else {
        socket.chat?.off("answerInvitation"); // Remove the listener
      }
    });

    const handleAccept = () => {
      const payloadInvite: PayloadAction = {
        action: "acceptInvitation",
        targetId: payload.userId,
      };
      socket.chat?.emit("chat-action", payloadInvite);
      toast.dismiss();
    };

    const handleDecline = () => {
      const payloadInvite: PayloadAction = {
        action: "refuseInvitation",
        targetId: payload.userId,
      };
      socket.chat?.emit("chat-action", payloadInvite);
      toast.dismiss();
    };

    const InviteActions = () => (
      <div>
        {payload.message}
        <div className="btn-container">
          <button className="btn accept" onClick={handleAccept}>
            ✓
          </button>
          <button className="btn decline" onClick={handleDecline}>
            ✗
          </button>
        </div>
      </div>
    );

    toast(<InviteActions />, {
      position: "bottom-center",
      autoClose: 15000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  useEffect(() => {
    socket.game?.on("leaderboard", (data: any) => {
      setUserId(data.userId);
      setLeaderboardData(data.leaderboard);
    });
    socket.chat?.on("acknowledgements", (payload) => {
      if (payload.type === "invitation") displayAcknowledgements(payload);
    });
    socket.game?.emit("leaderboard", { action: "status" });
    return () => {
      socket.chat?.off("acknowledgements");
      socket.game?.off("leaderboard");
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
      })
    );
    setLeaderboardList(tmpUsersList);
  }, [leaderboardData]);

  return (
    <article className="leaderboard-main-container">
      <header className="leaderboard-header">Leaderboard</header>

      <MDBContainer className="leaderboard-container">
        <UserProfilesList leaderboardList={leaderboardList} currentUserId={userId} />
      </MDBContainer>
    </article>
  );
};

export default LeaderBoard;
