import { type FC, useState } from 'react';
import {
  DEFAULT_GAME_CONFIG,
  type GameConfig,
  type GameResult,
} from './types';
import { GameStartScreen } from './GameStartScreen';
import { GamePlayScreen } from './GamePlayScreen';
import { GameFinishScreen } from './GameFinishScreen';

enum GameState {
  Start = 'start',
  Playing = 'playing',
  Finished = 'finished',
}

export const GamePage: FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [gameConfig, setGameConfig] = useState<GameConfig>(DEFAULT_GAME_CONFIG);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleStart = (config: GameConfig) => {
    setGameConfig(config);
    setGameState(GameState.Playing);
  };

  const handleFinish = (result: GameResult) => {
    setGameResult(result);
    setGameState(GameState.Finished);
  };

  if (gameState === GameState.Start) {
    return <GameStartScreen onStart={handleStart} />;
  }

  if (gameState === GameState.Playing) {
    return <GamePlayScreen config={gameConfig} onFinish={handleFinish} />;
  }

  if (gameState === GameState.Finished && gameResult) {
    return <GameFinishScreen result={gameResult} />;
  }

  return null;
};