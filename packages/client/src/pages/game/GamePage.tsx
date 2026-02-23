import { type FC, useState } from 'react';
import { GameStartScreen } from './GameStartScreen';

enum GameState {
  Start = 'start',
  Playing = 'playing',
  Finished = 'finished',
}

export const GamePage: FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);

  if (gameState === GameState.Start) {
    return <GameStartScreen onStart={() => setGameState(GameState.Playing)} />;
  }

  if (gameState === GameState.Playing) {
    return <div>TODO: Canvas</div>;
  }

  if (gameState === GameState.Finished) {
    return <div>TODO: Завершение игры</div>;
  }

  return null;
};
