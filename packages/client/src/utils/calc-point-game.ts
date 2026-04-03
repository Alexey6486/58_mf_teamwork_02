import { ComputerPlayerDifficulty, PlayerType } from "../pages/game/types";
import type { PlayerConfig } from "../pages/game/types"

const POINTS: Record<ComputerPlayerDifficulty, number> = {
  [ComputerPlayerDifficulty.EASY]: 10,
  [ComputerPlayerDifficulty.NORMAL]: 20,
  [ComputerPlayerDifficulty.HARD]: 30,
};
const DEFAULT_POINTS = 10;

export const calcPoint = (players: PlayerConfig[]): number => {
    const computerDifficulties = players
        .filter((p) => p.type === PlayerType.Computer && p.difficulty !== undefined)
        .map((p) => p.difficulty);

    if (computerDifficulties.length === 0) return DEFAULT_POINTS;

    const allPoints = computerDifficulties.map(difficulty => POINTS[difficulty as ComputerPlayerDifficulty]);

    return Math.max(...allPoints);
}