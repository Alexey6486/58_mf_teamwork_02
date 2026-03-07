export enum PlayerType {
  Computer = 'computer',
  Human = 'human',
}

export enum ComputerPlayerDifficulty {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
}

export type PlayerConfig = {
  name: string;
  type: PlayerType;
  difficulty?: ComputerPlayerDifficulty;
};

export type GameConfig = {
  players: PlayerConfig[];
  playerCount: number;
};

export interface PlayerData {
  name: string;
  totalScore: number;
  roundScore: number;
  cards: number[];
  isCurrent: boolean;
  isInGame: boolean;
}

export type GameResult = {
  winnerName: string;
  players: { name: string; totalScore: number }[];
};

export const DEFAULT_GAME_CONFIG: GameConfig = {
  players: [],
  playerCount: 0,
};

export enum CardType {
  SIMPLE = 'simple',
  ACTION = 'action',
  MULTIPLIER = 'multiplier',
}

export type ICard = {
  value: number | string;
  type: CardType;
};
