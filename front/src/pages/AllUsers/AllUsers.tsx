import { useEffect, useState } from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import { useWebsocketContext } from "services/Websocket/Websocket";
import { UserData } from "services/User/User";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import PayloadAction from "pages/ChatBox/models/PayloadSocket";
import { toast } from "react-toastify";
import AllUsersList from "./Components/AllUsersList";
import "./css/AllUsers.scss";

const AllUsers = () => {
  const [userId, setUserId] = useState<string>();
  const [usersData, setUsersData] = useState<any>({});
  const [usersList, setUsersList] = useState<any[]>([]);
  const socket = useWebsocketContext();
  const [socketData, setSocketData] = useState("");
  const navigate = useNavigate();

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
    socket.chat?.on("acknowledgements", (payload) => {
      if (payload.type === "invitation") displayAcknowledgements(payload);
    });
    return () => {
      socket.chat?.off("acknowledgements");
    };
  }, [socket.chat]);

  // Socket on + emit
  useEffect(() => {
    socket.game?.on("allUsers", (data: any) => {
      setUserId(data.userId);
      setUsersData(data.allUsers);
    });
    socket.game?.emit("allUsers", { action: "status" });
    return () => {
      socket.game?.off("allUsers");
    };
  }, [socket.game]);

  // Set data
  useEffect(() => {
    const tmpUsersList = (Object.entries(usersData) as Array<[string, UserData]>).map(
      ([userId, userData]: [string, UserData]) => ({
        id: userData.id,
        profilePicture: userData.profilePicture,
        username: userData.username,
        isOnline: userData.isOnline,
        isPlaying: userData.isPlaying,
      })
    );
    setUsersList(tmpUsersList);
  }, [usersData]);

  return (
    <article className="all-users-main-container">
      <header className="all-users-header">All users</header>

      <MDBContainer className="allusers-container">
        <AllUsersList usersList={usersList} currentUserId={userId} />
      </MDBContainer>
    </article>
  );
};

export default AllUsers;
