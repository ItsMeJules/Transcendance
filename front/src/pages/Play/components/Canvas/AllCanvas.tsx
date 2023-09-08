import { useRef } from "react";
import { GameProperties } from "pages/Play/models/Properties";
import { Socket } from "socket.io-client";
import MainText from "../MainText/MainText";
import CombinedCanvas from "./BoardBallCanvas";

interface AllCanvasProps {
  game: GameProperties;
  socket: Socket | null;
  whichPlayer: number;
  centralText: string;
  isPlayerReady: boolean;
  noGame: boolean;
}

const AllCanvas: React.FC<AllCanvasProps> = ({ game, socket, whichPlayer, centralText, isPlayerReady, noGame }) => {
  const combinedCanvasRef = useRef<HTMLCanvasElement | null | undefined>();

  return (
    <>
      {!noGame &&
        <main className="pong-game-canvas-main-container">
          <section className="pong-game-canvas" id='pong-canvas-container' style={{ height: `${game.board.height + 80}px` }}>
            {!game.isPlaying &&
              <MainText textToDisplay={centralText} socket={socket}
                whichPlayer={whichPlayer} gameIsPlaying={game.isPlaying}
                isPlayerReady={isPlayerReady} game={game} gameStatus={game.status} />}

            <canvas ref={combinedCanvasRef as React.RefObject<HTMLCanvasElement>} id="combinedCanvas" width={game.board.width} height={game.board.height} className="canvas-container-board" />

            <CombinedCanvas game={game} canvasRef={combinedCanvasRef as React.RefObject<HTMLCanvasElement>} whichPlayer={whichPlayer} socket={socket} />

          </section>
        </main>}
    </>
  );
}

export default AllCanvas;