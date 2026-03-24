import { type FC, useState } from 'react';
import { DEFAULT_GAME_CONFIG, type GameConfig, type GameResult } from './types';
import { GameStartScreen } from './GameStartScreen';
import { GamePlayScreen } from './GamePlayScreen';
import { GameFinishScreen } from './GameFinishScreen';
import {
  GAME_BODY_CONTAINER_CLASS,
  GAME_HEADER_CONTAINER_CLASS,
  GAME_HEADER_DIV_ITEMS_CLASS,
  ITEMS_CENTER_CLASS,
} from '../../constants/style-groups';
import { Button } from '../../components/Button';
import {
  PageInitArgs,
  ROUTES
} from '../../routes'
import { useNavigate } from 'react-router-dom';

enum GameState {
  Start = 'start',
  Playing = 'playing',
  Finished = 'finished',
}

export const GamePage: FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [gameConfig, setGameConfig] = useState<GameConfig>(DEFAULT_GAME_CONFIG);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const navigate = useNavigate();

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
      <div className={GAME_BODY_CONTAINER_CLASS}>
        {gameState === GameState.Start && (
          <GameStartScreen onStart={handleStart} />
        )}
        <header
          className={`${GAME_HEADER_CONTAINER_CLASS} ${ITEMS_CENTER_CLASS}`}>
          <div className={`${GAME_HEADER_DIV_ITEMS_CLASS}`}>
            <Button
              onClick={() => navigate(ROUTES.main)}
              // @ts-ignore
              content={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24">
                  <title>Arrow-back SVG Icon</title>
                  <path
                    className="fill-path-light dark:fill-path-dark"
                    d="M21 11H6.414l5.293-5.293l-1.414-1.414L2.586 12l7.707 7.707l1.414-1.414L6.414 13H21z"
                  />
                </svg>
              }
            />
          </div>
          <div className={`${GAME_HEADER_DIV_ITEMS_CLASS}`}>
            <Button
              onClick={() => window.location.reload()}
              content={'Завершить игру'}
            />
          </div>
          <div></div>
        </header>
        {gameState === GameState.Playing && (
          <GamePlayScreen config={gameConfig} onFinish={handleFinish} />
        )}
        {gameState === GameState.Finished && gameResult && (
          <GameFinishScreen result={gameResult} onRestart={handleRestart} />
        )}
      </div>
    </>
  );
};

export const initGamePage = async (_: PageInitArgs) => Promise.resolve();
