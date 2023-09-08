import { useEffect, useState } from "react";
import { useAxios } from "utils/axiosConfig/axiosConfig";
import { useNavigate } from "react-router-dom";
import { API_ROUTES, APP_ROUTES } from "utils/routing/routing";
import ToastMessage from "layout/ToastMessage/ToastMessage";
import { UserArray } from "services/User/UserArray";
import { UserData } from "services/User/User";
import User from "services/User/User";
import { MDBContainer } from "mdb-react-ui-kit";
import UserProfileList from "./Components/UserProfileList";
import { useWebsocketContext } from "services/Websocket/Websocket";
import PayloadAction from "pages/ChatBox/models/PayloadSocket";
import { toast } from "react-toastify";
import "./css/Friends.scss";

const Friends = () => {
  const [friendsData, setFriendsData] = useState<any>({});
  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [removeFlag, setRemoveFlag] = useState(false);
  const history = useNavigate();
  const [notifMsg, setNotifMsg] = useState("");
  const [idToRemove, setIdToRemove] = useState<string | undefined>("none");
  const socket = useWebsocketContext();
  const [socketData, setSocketData] = useState("");
  const navigate = useNavigate();
  const customAxiosInstance = useAxios();

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

  const truRemoveFlag = () => {
    setRemoveFlag(true);
  };

  // Socket on + emit
  useEffect(() => {
    socket.game?.on("friends", (data: any) => {
      setFriendsData(data.friends);
    });
    socket.game?.emit("friends", { action: "status" });
    return () => {
      socket.game?.off("friends");
    };
  }, [socket.game]);

  // Set data
  useEffect(() => {
    if (friendsData.length <= 0) {
      setFriendsList([]);
      return;
    }
    const tmpFriendsList = (Object.entries(friendsData) as Array<[string, UserData]>).map(
      ([userId, userData]: [string, UserData]) => ({
        id: userData.id,
        profilePicture: userData.profilePicture,
        username: userData.username,
        isOnline: userData.isOnline,
        isPlaying: userData.isPlaying,
      })
    );
    setFriendsList(tmpFriendsList);
  }, [friendsData]);

  const resetNotifMsg = () => {
    setNotifMsg(""); // Reset errMsg to an empty string
  };

  const resetIdToRemove = () => {
    setIdToRemove("none");
  };

  useEffect(() => {
    const removeUser = async (id: string | undefined) => {
      const dataToSend: any = {};
      if (id) dataToSend.id = id;
      try {
        const response = await customAxiosInstance.patch(API_ROUTES.ADD_FRIEND + id, dataToSend, {
          withCredentials: true,
        });
      } catch (err: any) {
        // Adequate error management
      }
      setRemoveFlag(false);
      setIdToRemove("none");
    };
    if (removeFlag) {
      removeUser(idToRemove);
    }
  }, [removeFlag, idToRemove]);

  const handleProfileClick = (user: User) => {
    setIdToRemove("none");
    resetNotifMsg();
    history(APP_ROUTES.GENERIC_USER_PROFILE + user.id);
  };

  return (
    <main className="right-screen-container">
      <article className="friends-main-container" style={{}}>
        <header className="friends-header">Friends</header>

        <MDBContainer className="friends-container">
          <UserProfileList friendsList={friendsList} onProfileClick={handleProfileClick} />
        </MDBContainer>

        <ToastMessage
          notifMsg={notifMsg}
          resetNotifMsg={resetNotifMsg}
          changeRemoveFlag={truRemoveFlag}
          resetIdToRemove={resetIdToRemove}
        />
      </article>
    </main>
  );
};

export default Friends;
