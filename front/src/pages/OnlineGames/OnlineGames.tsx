import { useEffect, useState } from "react";
import { useWebsocketContext } from "services/Websocket/Websocket";
import { MDBContainer } from "mdb-react-ui-kit";
import OnlineGamesList from "./Components/OnlineGamesList";

import "./css/OnlineGames.scss";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import PayloadAction from "pages/ChatBox/models/PayloadSocket";

import { toast } from "react-toastify";

interface OnlineGamesProps {
  noGame: boolean;
  setNoGame: (noGame: boolean) => void;
}

const OnlineGames: React.FC<OnlineGamesProps> = ({ noGame, setNoGame }) => {
  const socket = useWebsocketContext();
  const [gamesData, setGamesData] = useState<any>({});
  const [gameList, setGameList] = useState<any[]>([]);
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

  // Socket on
  useEffect(() => {
    socket.game?.on("onlineGames", (data: any) => {
      setNoGame(false);
      setGamesData(data);
    });
    socket.game?.emit("onlineGames", { action: "query" });
    return () => {
      socket.game?.off("onlineGames");
    };
  }, [socket.game]);

  useEffect(() => {
    const tmpGameList = (Object.entries(gamesData) as Array<[string, any]>).map(
      ([gameId, game]: [string, any]) => ({
        gameId: Number(gameId),
        player1: game.player1,
        player1Score: game.player1Score,
        player2: game.player2,
        player2Score: game.player2Score,
      })
    );
    setGameList(tmpGameList);
  }, [gamesData]);

  return (
    <article className="online-games-main-container">
      <header className="online-games-header">Online games</header>

      <MDBContainer className="online-games-container">
        <OnlineGamesList gamesList={gameList} />
      </MDBContainer>
    </article>
  );
};

export default OnlineGames;
