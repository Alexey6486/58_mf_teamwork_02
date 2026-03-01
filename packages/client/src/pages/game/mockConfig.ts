import { ComputerPlayerDifficulty, type GameConfig, PlayerType } from './types';

export const getMockConfig = () => {
  return {
    playerCount: 6,
    players: [
      {
        name: 'Player 1',
        type: PlayerType.Human,
      },
      {
        name: 'Player 2',
        type: PlayerType.Human,
      },
      {
        name: 'Computer 1',
        type: PlayerType.Computer,
        difficulty: ComputerPlayerDifficulty.NORMAL,
      },
      {
        name: 'Computer 2',
        type: PlayerType.Computer,
        difficulty: ComputerPlayerDifficulty.EASY,
      },
      {
        name: 'Computer 3',
        type: PlayerType.Computer,
        difficulty: ComputerPlayerDifficulty.NORMAL,
      },
      {
        name: 'Computer 4',
        type: PlayerType.Computer,
        difficulty: ComputerPlayerDifficulty.HARD,
      },
    ],
  } as GameConfig;
};
