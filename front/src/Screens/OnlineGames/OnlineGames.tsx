import { useEffect, useState } from "react";
import { useWebsocketContext } from "../../Wrappers/Websocket";
import User from "../../Services/User";
import { MDBContainer, MDBCard } from 'mdb-react-ui-kit';
import OnlineGamesHeader from "./Components/OnlineGamesHeader";
import OnlineGameInstance from "./Components/OnlineGameInstance";

const OnlineGames = () => {
  const socket = useWebsocketContext();
  const [gamesData, setGamesData] = useState<any>({})
  const [games, setGames] = useState<Map<number, { player1: User, player1Score: number, player2: User, player2Score: number }>>(new Map());
  const [gameList, setGameList] = useState<any[]>([]);

  useEffect(() => {
    socket.game?.on('onlineGames', (data) => {
      setGamesData(data);
    });
    socket.game?.emit('onlineGames', { action: 'query' });
  }, [socket.game]);

  useEffect(() => {
    const newGameList = (Object.entries(gamesData) as Array<[string, any]>).map(
      ([gameId, game]: [string, any]) => ({
        gameId: Number(gameId),
        player1: game.player1,
        player1Score: game.player1Score,
        player2: game.player2,
        player2Score: game.player2Score,
      }));
    setGameList(newGameList);
  }, [gamesData]);

  return (
    <div className="vh-100 d-flex" style={{ paddingTop: '75px', margin: '0px', }}>
      <MDBContainer className="online-games-main-container">
        <MDBCard className="online-games-card">
          <OnlineGamesHeader />
          <OnlineGameInstance gamesList={gameList} />
        </MDBCard>
      </MDBContainer>
      {/* <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} /> */}
    </div>
  );
}

export default OnlineGames;