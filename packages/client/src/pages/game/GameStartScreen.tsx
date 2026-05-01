import React, { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BTN_CLASS,
  BTN_GROUP_CLASS,
  COUNTER_BTN_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  PAGE_TITLE_SIZE_CLASS,
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
import { EIconButton } from '../../enums';
import { selectUser } from '../../slices/user-slice';
import { useSelector } from '../../store/store';
import { CardLayout } from '../../components/CardLayout';

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
  // берем login, при сохранении результата сравниваем по login
  const { login } = useSelector(selectUser) || {};
  const userName = login || 'Игрок 1';
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
      <CardLayout
        text="НАСТРОЙКИ ИГРЫ"
        textSize={PAGE_TITLE_SIZE_CLASS}
        bgColor="bg-f7-light-green"
        leftBtnCb={toMain}
        leftBtnIcon={EIconButton.BACK}
        leftBtnText="На главную страницу">
        <>
          <div className="flex flex-colw-full">
            <div>
              <div>
                {playersConfig.map((player, index) => (
                  <div className="mb-4" key={index}>
                    <span className="text-main-white dark:text-main-black mb-4 block">
                      Имя: {player.name}
                    </span>
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
                            key={dif}
                            className={`${TOGGLE_BTN_BASE_CLASS} ${
                              player.difficulty === dif
                                ? TOGGLE_BTN_ACTIVE_CLASS
                                : TOGGLE_BTN_INACTIVE_CLASS
                            } mr-2`}
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
          <div className={`${BTN_GROUP_CLASS} w-full`}>
            <Button onClick={handleStart} content="Начать игру" />
          </div>
        </>
      </CardLayout>
    </div>
  );
};
