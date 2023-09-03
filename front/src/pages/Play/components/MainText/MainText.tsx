import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { GameProperties } from '../../models/Properties';
import { APP_ROUTES } from 'utils/routing/routing';
import { Link } from 'react-router-dom';

interface MainTextProps {
  textToDisplay: string;
  socket: Socket | null;
  whichPlayer: number;
  gameIsPlaying: boolean;
  isPlayerReady: boolean;
  game: GameProperties;
  gameStatus: string | undefined;
  elementHeight: number | null;
}

const MainText: React.FC<MainTextProps> = ({ textToDisplay, socket, whichPlayer, gameIsPlaying, isPlayerReady, game, gameStatus, elementHeight }) => {
  const [isPlayerReadyComponent, setIsPlayerReadyComponent] = useState(false);
  const [finalPlayerReady, setFinalPlayerReady] = useState(false);

  const handleReadyClick = () => {
    if (whichPlayer === 0) return;
    if (!isPlayerReady) {
      setIsPlayerReadyComponent(true);
      if (socket)
        socket?.emit('prepareToPlay', { player: whichPlayer, action: 'playPressed' });
    }
  };

  useEffect(() => {
    if (isPlayerReady || isPlayerReadyComponent)
      setFinalPlayerReady(true);
  }, [isPlayerReady, isPlayerReadyComponent]);

  return (
    <article className='main-text-container'
      style={{ marginTop: `-${game.board.height / 2 - 20}px`, maxWidth: `${game.board.width - 100}px` }}>
      {/* Get ready button */}
      {(gameStatus === 'pending' || gameStatus === 'waiting') && !finalPlayerReady && whichPlayer !== 0 &&
        <button className="text-button-style" onClick={handleReadyClick}
          style={{ maxWidth: `${game.board.width - 100}px` }}>
          {textToDisplay}
        </button>}
      {/* Display text */}
      {(((!gameIsPlaying && finalPlayerReady) || gameStatus === 'giveUp'
        || gameStatus === 'timeout')) && whichPlayer !== 0 &&
        <section className="text-container-style">
          {textToDisplay}
        </section>}

      {/* Spectators messages */}
      {(gameStatus != 'playing' && whichPlayer === 0) &&
        <section className="text-container-style">
          {textToDisplay}
        </section>}

    </article>
  );
}

export default MainText;