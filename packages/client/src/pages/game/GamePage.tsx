import { type FC, useState } from 'react';
import { GameStartScreen } from './GameStartScreen';
import { DEFAULT_GAME_CONFIG, type GameConfig } from './types';

enum GameState {
  Start = 'start',
  Playing = 'playing',
  Finished = 'finished',
}

export const GamePage: FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [gameConfig, setGameConfig] = useState<GameConfig>(DEFAULT_GAME_CONFIG);

  const handleStart = (config: GameConfig) => {
    setGameConfig(config);
    setGameState(GameState.Playing);
  };

  if (gameState === GameState.Start) {
    return <GameStartScreen onStart={handleStart} />;
  }

  if (gameState === GameState.Playing) {
    return <div>TODO: Canvas (config: {JSON.stringify(gameConfig)})</div>;
  }

  if (gameState === GameState.Finished) {
    return <div>TODO: Завершение игры</div>;
  }

  return null;
};
