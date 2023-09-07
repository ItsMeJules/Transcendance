import React from 'react';
import { GameProperties } from '../../models/Properties';
import { useAppSelector } from 'utils/redux/Store';

interface ScoreBoardProps {
  game: GameProperties;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ game }) => {
  const { noGame } = useAppSelector(store => store.rightScreen)

  return (
    <>
      {!noGame &&
        < article className="score-main-container">
          <section>Score</section>
          <section>{game.pl1.score} - {game.pl2.score}</section>
        </article >}
    </>
  );
}

export default ScoreBoard;