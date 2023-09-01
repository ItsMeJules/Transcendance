import { useRef } from "react";
import { GameProperties } from "pages/Play/models/Properties";
import { Socket } from "socket.io-client";
import MainText from "../MainText/MainText";
import BoardCanvas from "./BoardCanvas";
import BallCanvas from "./BallCanvas";
import PaddleCanvas from "./PaddleCanvas";

interface AllCanvasProps {
  game: GameProperties;
  socket: Socket | null;
  whichPlayer: number;
  centralText: string;
  isPlayerReady: boolean;
  profileCardHeight: number;
  noGame: boolean;
}

const AllCanvas: React.FC<AllCanvasProps> = ({ game, socket, whichPlayer, centralText, isPlayerReady, profileCardHeight, noGame }) => {
  const boardCanvasRef = useRef<HTMLCanvasElement | null | undefined>();
  const ballCanvasRef = useRef<HTMLCanvasElement | null | undefined>();
  const paddle1CanvasRef = useRef<HTMLCanvasElement | null | undefined>();
  const paddle2CanvasRef = useRef<HTMLCanvasElement | null | undefined>();
  return (
    <>
      {!noGame && 
      <main className="pong-game-canvas-main-container">
        <section className="pong-game-canvas" id='pong-canvas-container' style={{ height: `${game.board.height + 80}px` }}>
          {!game.isPlaying && 
          <MainText textToDisplay={centralText} socket={socket}
            whichPlayer={whichPlayer} gameIsPlaying={game.isPlaying}
            isPlayerReady={isPlayerReady} game={game}
            elementHeight={profileCardHeight} gameStatus={game.status} />}
          <canvas ref={boardCanvasRef as React.RefObject<HTMLCanvasElement>} id="boardCanvas" width={game.board.width} height={game.board.height} className="canvas-container-board" />
          <canvas ref={ballCanvasRef as React.RefObject<HTMLCanvasElement>} id="ballCanvas" width={game.board.width} height={game.board.height} className="canvas-container-ball" />
          <canvas ref={paddle1CanvasRef as React.RefObject<HTMLCanvasElement>} id="paddleCanvas" width={game.board.width} height={game.board.height} className="canvas-container-paddle" />
          <canvas ref={paddle2CanvasRef as React.RefObject<HTMLCanvasElement>} id="paddleCanvas" width={game.board.width} height={game.board.height} className="canvas-container-paddle" />

          <BoardCanvas game={game} canvasRef={boardCanvasRef as React.RefObject<HTMLCanvasElement>} />
          <BallCanvas game={game} canvasRef={ballCanvasRef as React.RefObject<HTMLCanvasElement>} />
          <PaddleCanvas game={game} player={game.pl1} canvasRef={paddle1CanvasRef as React.RefObject<HTMLCanvasElement>} whichPlayer={whichPlayer} socket={socket} />
          <PaddleCanvas game={game} player={game.pl2} canvasRef={paddle2CanvasRef as React.RefObject<HTMLCanvasElement>} whichPlayer={whichPlayer} socket={socket} />
        </section>
      </main>}
    </>
  );
}

export default AllCanvas;