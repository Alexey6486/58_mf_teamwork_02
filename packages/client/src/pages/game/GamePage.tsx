import { type FC, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DEFAULT_GAME_CONFIG, type GameConfig, type GameResult } from './types';
import { GameStartScreen } from './GameStartScreen';
import { GamePlayScreen } from './GamePlayScreen';
import { GameFinishScreen } from './GameFinishScreen';
import { type PageInitArgs } from '../../routes';

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

  const handleRestart = () => {
    setGameState(GameState.Playing);
  };

  const handleFinish = (result: GameResult) => {
    setGameResult(result);
    setGameState(GameState.Finished);
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Страница игры</title>
        <meta name="description" content="Страница игры" />
      </Helmet>
      {gameState === GameState.Start && (
        <GameStartScreen onStart={handleStart} />
      )}
      {gameState === GameState.Playing && (
        <GamePlayScreen config={gameConfig} onFinish={handleFinish} />
      )}
      {gameState === GameState.Finished && gameResult && (
        <GameFinishScreen result={gameResult} onRestart={handleRestart} />
      )}
    </>
  );
};

export const initGamePage = async (_: PageInitArgs) => Promise.resolve();
