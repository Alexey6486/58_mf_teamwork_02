import { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  APP_TITLE_CLASS,
  BTN_GROUP_CLASS,
  COUNTER_BTN_CLASS,
  FORM_CONTAINER_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  FORM_TITLE_CLASS,
  TITLE_CLASS,
  TOGGLE_BTN_ACTIVE_CLASS,
  TOGGLE_BTN_BASE_CLASS,
  TOGGLE_BTN_INACTIVE_CLASS,
} from '../../constants/style-groups';
import { Button } from '../../components/Button';
import {
  ComputerPlayerDifficulty,
  type GameConfig,
  type PlayerConfig,
  PlayerType,
} from './types';
import { ROUTES } from '../../routes';
import { MAX_PLAYERS, MIN_PLAYERS } from '../../constants/game';
import { selectUser } from '../../slices/user-slice';
import { useSelector } from '../../store/store';

const PLAYER_TYPE_LABELS: Record<PlayerType, string> = {
  [PlayerType.Human]: 'Человек',
  [PlayerType.Computer]: 'Компьютер',
};

type GameStartScreenProps = {
  onStart: (config: GameConfig) => void;
};

export const GameStartScreen: FC<GameStartScreenProps> = ({ onStart }) => {
  const navigate = useNavigate();
  const { first_name, display_name } = useSelector(selectUser) || {};
  const userName = display_name || first_name || 'Игрок';
  const [playerType, setPlayerType] = useState<PlayerType>(PlayerType.Computer);
  const [playerCount, setPlayerCount] = useState(MIN_PLAYERS);

  const handlePlayerCountChange = (delta: number) => {
    const next = playerCount + delta;
    if (next >= MIN_PLAYERS && next <= MAX_PLAYERS) {
      setPlayerCount(next);
    }
  };

  const handleStart = () => {
    // const config: GameConfig = getMockConfig();
    const players: PlayerConfig[] = [
      { name: userName, type: PlayerType.Human },
    ];
    if (playerType === PlayerType.Human)
      players.push({ name: 'Игрок 2', type: PlayerType.Human });
    else {
      for (let i = 0; i < playerCount - 1; i++)
        players.push({
          name: `Компьютер ${i + 1}`,
          type: PlayerType.Computer,
          difficulty: ComputerPlayerDifficulty.NORMAL,
        });
    }

    const config: GameConfig = {
      playerCount: players.length,
      players: players,
    };
    onStart(config);
  };

  return (
    <div className={FORM_PAGE_CONTAINER_CLASS}>
      <div className={FORM_CONTAINER_CLASS}>
        <div className="w-full flex justify-start absolute pl-8 pr-8 top-12 left-0">
          <button onClick={() => navigate(ROUTES.main)}>
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
          </button>
        </div>
        <h1 className={APP_TITLE_CLASS}>Flip 7</h1>
        <h2 className={FORM_TITLE_CLASS}>Настройки игры</h2>
        <div className="flex flex-col gap-6 w-full">
          <div className="flex gap-2 w-full">
            {[PlayerType.Computer, PlayerType.Human].map(type => (
              <button
                key={type}
                className={`${TOGGLE_BTN_BASE_CLASS} ${
                  playerType === type
                    ? TOGGLE_BTN_ACTIVE_CLASS
                    : TOGGLE_BTN_INACTIVE_CLASS
                }`}
                onClick={() => setPlayerType(type)}>
                {PLAYER_TYPE_LABELS[type]}
              </button>
            ))}
          </div>

          {playerType === PlayerType.Computer && (
            <div className="flex flex-col gap-2 items-center">
              <span className={`${TITLE_CLASS} text-center`}>
                Количество игроков
              </span>
              <div className="flex items-center gap-4">
                <button
                  className={COUNTER_BTN_CLASS}
                  onClick={() => handlePlayerCountChange(-1)}
                  disabled={playerCount <= MIN_PLAYERS}>
                  −
                </button>
                <span className={`${TITLE_CLASS} text-xl w-4 text-center`}>
                  {playerCount}
                </span>
                <button
                  className={COUNTER_BTN_CLASS}
                  onClick={() => handlePlayerCountChange(1)}
                  disabled={playerCount >= MAX_PLAYERS}>
                  +
                </button>
              </div>
            </div>
          )}
        </div>
        <div className={BTN_GROUP_CLASS}>
          <Button onClick={handleStart} content="Начать игру" />
        </div>
      </div>
    </div>
  );
};
