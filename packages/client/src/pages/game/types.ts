export enum PlayerType {
  Computer = 'computer',
  Human = 'human',
}

export type GameConfig = {
  playerType: PlayerType;
  playerCount: number;
};

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 8;

export const DEFAULT_GAME_CONFIG: GameConfig = {
  playerType: PlayerType.Computer,
  playerCount: MIN_PLAYERS,
};
