import { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  APP_TITLE_CLASS,
  BTN_CLASS,
  BTN_GROUP_CLASS,
  COUNTER_BTN_CLASS,
  FORM_CONTAINER_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  FORM_TITLE_CLASS,
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
import { IconButton } from '../../components/IconButton';
import { EIconButton } from '../../enums';
import { selectUser } from '../../slices/user-slice';
import { useSelector } from '../../store/store';

const COMPUTER_DIFFICULTY_LABELS: Record<ComputerPlayerDifficulty, string> = {
  [ComputerPlayerDifficulty.EASY]: 'Комп.Легкий',
  [ComputerPlayerDifficulty.NORMAL]: 'Комп.Средний',
  [ComputerPlayerDifficulty.HARD]: 'Комп.Тяжелый',
};

type GameStartScreenProps = {
  onStart: (config: GameConfig) => void;
};

const getDefaultConfig = (user: string) => {
  return [
    { name: user, type: PlayerType.Human },
    {
      name: 'Игрок 2',
      type: PlayerType.Computer,
      difficulty: ComputerPlayerDifficulty.NORMAL,
    },
  ] as PlayerConfig[];
};

export const GameStartScreen: FC<GameStartScreenProps> = ({ onStart }) => {
  const navigate = useNavigate();
  const { first_name, display_name } = useSelector(selectUser) || {};
  const userName = display_name || first_name || 'Игрок 1';
  // const [playerType, setPlayerType] = useState<PlayerType>(PlayerType.Computer);
  const [playerCount, setPlayerCount] = useState(MIN_PLAYERS);
  const [playersConfig, setPlayersConfig] = useState<PlayerConfig[]>(
    getDefaultConfig(userName)
  );

  const handlePlayerCountChange = (delta: number) => {
    const next = playerCount + delta;
    if (next >= MIN_PLAYERS && next <= MAX_PLAYERS) {
      setPlayerCount(next);
    }
  };

  const fillPlayer = () => {
    handlePlayerCountChange(1);
    const newPlayer: PlayerConfig = {
      name: `Игрок ${playerCount}`,
      type: PlayerType.Human,
    };
    playersConfig.push(newPlayer);
    setPlayersConfig(playersConfig);
  };

  const removePlayer = (index: number) => {
    handlePlayerCountChange(-1);
    const newNameArr = playersConfig.slice(index + 1);
    for (let i = 0; i < newNameArr.length; i++) {
      newNameArr[i].name = `Игрок ${index + i + 1}`;
    }
    const updated = [...playersConfig];
    updated.splice(index, playersConfig.length, ...newNameArr);
    setPlayersConfig(updated);
  };

  const changePlayerType = (
    player: PlayerConfig,
    type: PlayerType,
    index: number,
    dif?: ComputerPlayerDifficulty
  ) => {
    const newPlayer = player;

    if (type === PlayerType.Human && player.type === PlayerType.Computer) {
      (newPlayer.type = type), delete newPlayer.difficulty;
    }
    if (type === PlayerType.Computer && player.type === PlayerType.Human) {
      (newPlayer.type = type), (newPlayer.difficulty = dif);
    }
    if (type === player.type && dif) {
      newPlayer.difficulty = dif;
    }

    const updated = [...playersConfig];
    updated.splice(index, 1, newPlayer);
    setPlayersConfig(updated);
  };

  const handleStart = () => {
    const config: GameConfig = {
      players: playersConfig,
      playerCount: playerCount,
    };
    onStart(config);
  };

  const toMain = () => {
    navigate(ROUTES.main);
  };

  return (
    <div className={FORM_PAGE_CONTAINER_CLASS}>
      <div className={FORM_CONTAINER_CLASS}>
        <div className="w-full flex justify-start absolute pl-8 pr-8 top-12 left-0">
          <IconButton
            onClick={toMain}
            iconName={EIconButton.BACK}
            hoverName={'На главную страницу'}
          />
        </div>
        <h1 className={APP_TITLE_CLASS}>Flip 7</h1>
        <h2 className={FORM_TITLE_CLASS}>Настройки игры</h2>
        <div className="flex flex-col gap-6 w-full">
          <div>
            <div>
              {playersConfig.map((player, index) => (
                <div key={index}>
                  <span>{player.name}</span>
                  <div className="flex gap-2 w-full">
                    <button
                      className={`${TOGGLE_BTN_BASE_CLASS} ${
                        player.type === 'human'
                          ? TOGGLE_BTN_ACTIVE_CLASS
                          : TOGGLE_BTN_INACTIVE_CLASS
                      }`}
                      onClick={() =>
                        changePlayerType(player, PlayerType.Human, index)
                      }>
                      Человек
                    </button>
                    <div>
                      {[
                        ComputerPlayerDifficulty.EASY,
                        ComputerPlayerDifficulty.NORMAL,
                        ComputerPlayerDifficulty.HARD,
                      ].map(dif => (
                        <button
                          className={`${TOGGLE_BTN_BASE_CLASS} ${
                            player.difficulty === dif
                              ? TOGGLE_BTN_ACTIVE_CLASS
                              : TOGGLE_BTN_INACTIVE_CLASS
                          }`}
                          onClick={() =>
                            changePlayerType(
                              player,
                              PlayerType.Computer,
                              index,
                              dif
                            )
                          }>
                          {COMPUTER_DIFFICULTY_LABELS[dif]}
                        </button>
                      ))}
                    </div>
                    <button
                      className={COUNTER_BTN_CLASS}
                      onClick={() => removePlayer(index)}
                      disabled={playerCount <= 2}>
                      -
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className={BTN_GROUP_CLASS}>
              <button
                className={BTN_CLASS}
                onClick={() => fillPlayer()}
                disabled={playerCount >= MAX_PLAYERS}>
                Добавить игрока
              </button>
            </div>
          </div>
        </div>
        <div className={BTN_GROUP_CLASS}>
          <Button onClick={handleStart} content="Начать игру" />
        </div>
      </div>
    </div>
  );
};
